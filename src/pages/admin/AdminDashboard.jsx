import { ImageSquare, MagnifyingGlass, PencilSimple, Plus, Tag, TrashSimple } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useCatalog } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { supabase } from '../../lib/supabase.js'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-[#131210] p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#cda45e]/12 text-[#cda45e]">
        <Icon size={20} weight="bold" />
      </span>
      <div>
        <p className="font-display text-2xl text-[#f4ecdd]">{value}</p>
        <p className="text-xs uppercase tracking-wide text-[#948a79]">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { categories, products, loading, refetch } = useCatalog()
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  function categoryLabels(ids) {
    return ids.map((id) => categories.find((c) => c.id === id)?.label ?? id)
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.categories.includes(categoryFilter)
      return matchesSearch && matchesCategory
    })
  }, [products, search, categoryFilter])

  const missingPhoto = products.filter((p) => !p.image).length

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const { error } = await supabase.from('products').delete().eq('slug', pendingDelete.slug)
    setDeleting(false)
    setPendingDelete(null)
    if (error) {
      show(`Couldn't delete "${pendingDelete.name}": ${error.message}`, 'error')
      return
    }
    show(`Deleted "${pendingDelete.name}"`, 'success')
    refetch()
  }

  return (
    <AdminLayout
      title="Products"
      subtitle={loading ? undefined : `${products.length} product${products.length === 1 ? '' : 's'} across ${categories.length} categories`}
      actions={
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#cda45e] px-5 py-2.5 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887]"
        >
          <Plus size={16} weight="bold" />
          Add product
        </Link>
      }
    >
      {loading ? (
        <p className="text-[#948a79]">Loading&hellip;</p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard icon={Tag} label="Products" value={products.length} />
            <StatCard icon={Tag} label="Categories" value={categories.length} />
            <StatCard icon={ImageSquare} label="Missing a photo" value={missingPhoto} />
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#948a79]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products&hellip;"
                className="w-full rounded-full border border-white/15 bg-[#131210] py-2.5 pl-10 pr-4 text-sm text-[#f4ecdd] outline-none placeholder:text-[#6b6355] focus:border-[#cda45e]/50"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-white/15 bg-[#131210] px-4 py-2.5 text-sm text-[#cabfab] outline-none focus:border-[#cda45e]/50"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-white/15 py-16 text-center">
              <p className="text-[#948a79]">
                {products.length === 0 ? 'No products yet.' : 'No products match your search.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div
                  key={p.slug}
                  className="group overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#131210] transition-colors hover:border-white/20"
                >
                  <div className="relative aspect-4/3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1b1815]">
                        <ImageSquare size={28} className="text-[#3d3830]" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/60 group-hover:opacity-100">
                      <Link
                        to={`/admin/products/${p.slug}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#181109] hover:bg-white"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(p)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/95 text-white hover:bg-red-500"
                      >
                        <TrashSimple size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-[#f4ecdd]">{p.name}</h3>
                      <span className="shrink-0 text-sm text-[#e8c887]">{p.price}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categoryLabels(p.categories).map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-[#948a79]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this product?"
        message={`"${pendingDelete?.name}" will be removed from the site immediately. This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  )
}
