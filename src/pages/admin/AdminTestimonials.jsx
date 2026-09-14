import { Plus, Quotes, TrashSimple } from '@phosphor-icons/react'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useCatalog } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { supabase } from '../../lib/supabase.js'

const fieldCls =
  'w-full rounded-lg border border-white/15 bg-[#1b1815] px-3.5 py-2.5 text-[#f4ecdd] outline-none transition-colors focus:border-[#cda45e]/60'
const labelCls = 'mb-1.5 block text-sm text-[#cabfab]'

function TestimonialCard({ testimonial, onSaved, onDelete }) {
  const [quote, setQuote] = useState(testimonial.quote)
  const [name, setName] = useState(testimonial.name)
  const [role, setRole] = useState(testimonial.role)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const { show } = useToast()

  const dirty = quote !== testimonial.quote || name !== testimonial.name || role !== testimonial.role

  async function handleSave() {
    setSaving(true)
    setError('')
    const { error: saveError } = await supabase
      .from('testimonials')
      .update({ quote, name, role })
      .eq('id', testimonial.id)
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      show('Failed to save review', 'error')
      return
    }
    show(`Saved review from "${name}"`, 'success')
    onSaved()
  }

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#131210] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cda45e]/12 text-[#cda45e]">
          <Quotes size={14} weight="fill" />
        </span>
        <button
          type="button"
          onClick={() => onDelete(testimonial)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#948a79] transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Delete review"
        >
          <TrashSimple size={15} />
        </button>
      </div>

      <label className="mb-3 block text-sm">
        <span className={labelCls}>Quote</span>
        <textarea rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} className={fieldCls} />
      </label>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className={labelCls}>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} />
        </label>
        <label className="block text-sm">
          <span className={labelCls}>Role</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Birthday client"
            className={fieldCls}
          />
        </label>
      </div>
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

export default function AdminTestimonials() {
  const { testimonials, loading, refetch } = useCatalog()
  const { show } = useToast()
  const [newQuote, setNewQuote] = useState('')
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    if (!newQuote.trim() || !newName.trim() || !newRole.trim()) {
      setError('Fill in quote, name, and role.')
      return
    }
    setCreating(true)
    const { error: createError } = await supabase
      .from('testimonials')
      .insert({ quote: newQuote, name: newName, role: newRole, sort_order: testimonials.length })
    setCreating(false)
    if (createError) {
      setError(createError.message)
      show('Failed to add review', 'error')
      return
    }
    setNewQuote('')
    setNewName('')
    setNewRole('')
    show(`Added review from "${newName}"`, 'success')
    refetch()
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const { error } = await supabase.from('testimonials').delete().eq('id', pendingDelete.id)
    setDeleting(false)
    setPendingDelete(null)
    if (error) {
      show(`Couldn't delete review: ${error.message}`, 'error')
      return
    }
    show('Deleted review', 'success')
    refetch()
  }

  return (
    <AdminLayout
      title="Reviews"
      subtitle={loading ? undefined : `${testimonials.length} review${testimonials.length === 1 ? '' : 's'} shown on the homepage`}
    >
      {loading ? (
        <p className="text-[#948a79]">Loading&hellip;</p>
      ) : testimonials.length === 0 ? (
        <p className="text-[#948a79]">No reviews yet. Add your first one below.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} onSaved={refetch} onDelete={setPendingDelete} />
          ))}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-8 max-w-md rounded-[1.25rem] border border-dashed border-white/15 p-5"
      >
        <p className="mb-4 flex items-center gap-2 font-display text-lg text-[#f4ecdd]">
          <Plus size={18} />
          Add a review
        </p>
        <label className="mb-3 block text-sm">
          <span className={labelCls}>Quote</span>
          <textarea
            rows={3}
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="What the client said&hellip;"
            className={fieldCls}
          />
        </label>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className={labelCls}>Name</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ananya R."
              className={fieldCls}
            />
          </label>
          <label className="block text-sm">
            <span className={labelCls}>Role</span>
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Birthday client"
              className={fieldCls}
            />
          </label>
        </div>
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="rounded-full bg-[#cda45e] px-5 py-2 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887] disabled:opacity-60"
        >
          {creating ? 'Adding…' : 'Add review'}
        </button>
      </form>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this review?"
        message={`The review from "${pendingDelete?.name}" will be removed from the site immediately. This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  )
}
