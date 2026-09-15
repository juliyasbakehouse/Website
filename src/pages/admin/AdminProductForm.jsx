import { Check, Star } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import ImageDropzone from '../../components/admin/ImageDropzone.jsx'
import { findProductBySlug, useCatalog } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { compressImage } from '../../lib/compressImage.js'
import { supabase } from '../../lib/supabase.js'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyForm = {
  slug: '',
  name: '',
  desc: '',
  price: '',
  serves: '',
  tag: '',
  imagePosition: '',
  categories: [],
  featured: false,
}

const fieldCls =
  'w-full rounded-lg border border-white/15 bg-[#1b1815] px-3.5 py-2.5 text-[#f4ecdd] outline-none transition-colors focus:border-[#cda45e]/60'
const labelCls = 'mb-1.5 block text-sm text-[#cabfab]'

export default function AdminProductForm() {
  const { slug: editSlug } = useParams()
  const isEditing = Boolean(editSlug)
  const navigate = useNavigate()
  const { categories, products, loading, refetch } = useCatalog()
  const { show } = useToast()

  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEditing || loading) return
    const existing = findProductBySlug(products, editSlug)
    if (!existing) {
      setNotFound(true)
      return
    }
    setForm({
      slug: existing.slug,
      name: existing.name,
      desc: existing.desc,
      price: existing.price,
      serves: existing.serves,
      tag: existing.tag || '',
      imagePosition: existing.imagePosition || '',
      categories: existing.categories,
      featured: existing.featured || false,
    })
    setImagePreview(existing.image || null)
    setSlugTouched(true)
  }, [isEditing, loading, editSlug, products])

  function handleNameChange(value) {
    setForm((f) => ({ ...f, name: value, slug: slugTouched ? f.slug : slugify(value) }))
  }

  function toggleCategory(id) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id) ? f.categories.filter((c) => c !== id) : [...f.categories, id],
    }))
  }

  function handleImageSelect(file) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleImageRemove() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.slug || !form.name || !form.desc || !form.price || !form.serves) {
      setError('Please fill in name, description, price, and serves.')
      return
    }
    if (form.categories.length === 0) {
      setError('Select at least one category.')
      return
    }

    setSaving(true)

    // No new file chosen: keep the existing image URL, or null if it was removed.
    let imageUrl = imageFile ? undefined : imagePreview
    if (imageFile) {
      let upload
      try {
        upload = await compressImage(imageFile)
      } catch {
        upload = imageFile
      }
      const ext = upload.name.split('.').pop()
      const path = `${form.slug}-${Date.now()}.${ext}`
      // Filenames are unique per upload, so the file at a path never changes and can be cached for a year.
      const { error: uploadError } = await supabase.storage.from('cake-photos').upload(path, upload, {
        cacheControl: '31536000',
        contentType: upload.type,
        upsert: false,
      })
      if (uploadError) {
        setSaving(false)
        setError(`Image upload failed: ${uploadError.message}`)
        show('Image upload failed', 'error')
        return
      }
      const { data: urlData } = supabase.storage.from('cake-photos').getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const wasFeatured = isEditing ? findProductBySlug(products, editSlug)?.featured : false
    const featuredOrder = form.featured && !wasFeatured ? products.filter((p) => p.featured).length : undefined

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.desc,
      price: form.price,
      serves: form.serves,
      tag: form.tag || null,
      image_url: imageUrl ?? null,
      image_position: form.imagePosition || null,
      category_ids: form.categories,
      is_featured: form.featured,
      ...(featuredOrder !== undefined ? { featured_order: featuredOrder } : {}),
    }

    const { error: saveError } = isEditing
      ? await supabase.from('products').update(payload).eq('slug', editSlug)
      : await supabase.from('products').insert(payload)

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      show('Failed to save product', 'error')
      return
    }

    await refetch()
    show(isEditing ? `Saved "${form.name}"` : `Added "${form.name}"`, 'success')
    navigate('/admin')
  }

  if (notFound) {
    return (
      <AdminLayout title="Product not found">
        <p className="text-[#948a79]">
          No product with slug "{editSlug}".{' '}
          <Link to="/admin" className="text-[#cda45e] hover:text-[#e8c887]">
            Back to products
          </Link>
        </p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title={isEditing ? 'Edit product' : 'Add product'}
      subtitle={isEditing ? form.name || editSlug : 'Add a new cake, cupcake, or treat to the menu'}
    >
      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div>
            <span className={labelCls}>Photo</span>
            <ImageDropzone preview={imagePreview} onSelect={handleImageSelect} onRemove={handleImageRemove} />
          </div>
          <label className="block text-sm">
            <span className={labelCls}>
              Image crop position <span className="text-[#6b6355]">(optional)</span>
            </span>
            <input
              type="text"
              placeholder='e.g. "center 75%"'
              value={form.imagePosition}
              onChange={(e) => setForm((f) => ({ ...f, imagePosition: e.target.value }))}
              className={fieldCls}
            />
            <p className="mt-1.5 text-xs text-[#6b6355]">Use if the photo is cropping oddly in the 4:3 frame.</p>
          </label>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className={labelCls}>Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={fieldCls}
              />
            </label>
            <label className="block text-sm">
              <span className={labelCls}>
                URL slug {isEditing && <span className="text-[#6b6355]">(fixed)</span>}
              </span>
              <input
                type="text"
                required
                disabled={isEditing}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                }}
                className={`${fieldCls} disabled:opacity-50`}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className={labelCls}>Description</span>
            <textarea
              required
              rows={3}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className={fieldCls}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block text-sm">
              <span className={labelCls}>Price</span>
              <input
                type="text"
                required
                placeholder="From ₹1,800"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className={fieldCls}
              />
            </label>
            <label className="block text-sm">
              <span className={labelCls}>Serves</span>
              <input
                type="text"
                required
                placeholder="Serves 10–12"
                value={form.serves}
                onChange={(e) => setForm((f) => ({ ...f, serves: e.target.value }))}
                className={fieldCls}
              />
            </label>
            <label className="block text-sm">
              <span className={labelCls}>
                Tag <span className="text-[#6b6355]">(optional)</span>
              </span>
              <input
                type="text"
                placeholder="Best seller"
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className={fieldCls}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#1b1815] px-4 py-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-4 w-4 accent-[#cda45e]"
            />
            <Star size={16} weight={form.featured ? 'fill' : 'regular'} className="text-[#cda45e]" />
            <span className="text-sm text-[#cabfab]">
              Show on homepage <span className="text-[#6b6355]">(under "A few of our favourites", first 3 marked)</span>
            </span>
          </label>

          <div>
            <span className={labelCls}>Categories</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = form.categories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      selected
                        ? 'border-[#cda45e] bg-[#cda45e] text-[#181109]'
                        : 'border-white/15 text-[#cabfab] hover:border-white/30 hover:text-[#f4ecdd]'
                    }`}
                  >
                    {selected && <Check size={13} weight="bold" />}
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#cda45e] px-6 py-2.5 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887] disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add product'}
            </button>
            <Link to="/admin" className="text-sm text-[#948a79] hover:text-[#cabfab]">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
