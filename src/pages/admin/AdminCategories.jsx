import { Plus, Tag, TrashSimple } from '@phosphor-icons/react'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { getCategoryItems, useCatalog } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { supabase } from '../../lib/supabase.js'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const fieldCls =
  'w-full rounded-lg border border-white/15 bg-[#1b1815] px-3.5 py-2.5 text-[#f4ecdd] outline-none transition-colors focus:border-[#cda45e]/60'
const labelCls = 'mb-1.5 block text-sm text-[#cabfab]'

function CategoryCard({ category, productCount, onSaved, onDelete }) {
  const [label, setLabel] = useState(category.label)
  const [blurb, setBlurb] = useState(category.blurb)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const { show } = useToast()

  const dirty = label !== category.label || blurb !== category.blurb

  async function handleSave() {
    setSaving(true)
    setError('')
    const { error: saveError } = await supabase.from('categories').update({ label, blurb }).eq('id', category.id)
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      show('Failed to save category', 'error')
      return
    }
    show(`Saved "${label}"`, 'success')
    onSaved()
  }

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#131210] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cda45e]/12 text-[#cda45e]">
            <Tag size={14} weight="bold" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6b6355]">{category.id}</p>
            <p className="text-xs text-[#948a79]">
              {productCount} product{productCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(category, productCount)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#948a79] transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Delete category"
        >
          <TrashSimple size={15} />
        </button>
      </div>

      <label className="mb-3 block text-sm">
        <span className={labelCls}>Label</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} className={fieldCls} />
      </label>
      <label className="mb-3 block text-sm">
        <span className={labelCls}>Blurb</span>
        <textarea rows={2} value={blurb} onChange={(e) => setBlurb(e.target.value)} className={fieldCls} />
      </label>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty || saving}
        className="rounded-full bg-[#cda45e] px-4 py-1.5 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887] disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}

export default function AdminCategories() {
  const { categories, products, loading, refetch } = useCatalog()
  const { show } = useToast()
  const [newLabel, setNewLabel] = useState('')
  const [newBlurb, setNewBlurb] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    const id = slugify(newLabel)
    if (!id) {
      setError('Enter a label first.')
      return
    }
    setCreating(true)
    const { error: createError } = await supabase
      .from('categories')
      .insert({ id, label: newLabel, blurb: newBlurb, sort_order: categories.length })
    setCreating(false)
    if (createError) {
      setError(createError.message)
      show('Failed to add category', 'error')
      return
    }
    setNewLabel('')
    setNewBlurb('')
    show(`Added "${newLabel}"`, 'success')
    refetch()
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const categoryId = pendingDelete.category.id

    const affected = products.filter((p) => p.categories.includes(categoryId))
    for (const product of affected) {
      const remaining = product.categories.filter((c) => c !== categoryId)
      await supabase.from('products').update({ category_ids: remaining }).eq('slug', product.slug)
    }

    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    setDeleting(false)
    setPendingDelete(null)
    if (error) {
      show(`Couldn't delete "${pendingDelete.category.label}": ${error.message}`, 'error')
      return
    }
    show(`Deleted "${pendingDelete.category.label}"`, 'success')
    refetch()
  }

  return (
    <AdminLayout title="Categories" subtitle={loading ? undefined : `${categories.length} categories`}>
      {loading ? (
        <p className="text-[#948a79]">Loading&hellip;</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={getCategoryItems(products, cat.id).length}
              onSaved={refetch}
              onDelete={(category, productCount) => setPendingDelete({ category, productCount })}
            />
          ))}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-8 max-w-md rounded-[1.25rem] border border-dashed border-white/15 p-5"
      >
        <p className="mb-4 flex items-center gap-2 font-display text-lg text-[#f4ecdd]">
          <Plus size={18} />
          Add a category
        </p>
        <label className="mb-3 block text-sm">
          <span className={labelCls}>Label</span>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Wedding & Custom"
            className={fieldCls}
          />
        </label>
        <label className="mb-4 block text-sm">
          <span className={labelCls}>Blurb</span>
          <textarea
            rows={2}
            value={newBlurb}
            onChange={(e) => setNewBlurb(e.target.value)}
            className={fieldCls}
          />
        </label>
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="rounded-full bg-[#cda45e] px-5 py-2 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887] disabled:opacity-60"
        >
          {creating ? 'Adding…' : 'Add category'}
        </button>
      </form>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        message={
          pendingDelete?.productCount > 0
            ? `"${pendingDelete.category.label}" is used by ${pendingDelete.productCount} product${pendingDelete.productCount === 1 ? '' : 's'}. They'll keep their other categories, but lose this one. This can't be undone.`
            : `"${pendingDelete?.category.label}" will be removed. This can't be undone.`
        }
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  )
}
