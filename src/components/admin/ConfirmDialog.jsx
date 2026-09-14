import { Warning } from '@phosphor-icons/react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-6" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[1.25rem] border border-white/10 bg-[#161311] p-6 shadow-2xl"
      >
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
            danger ? 'bg-red-500/15 text-red-400' : 'bg-[#cda45e]/15 text-[#cda45e]'
          }`}
        >
          <Warning size={20} weight="bold" />
        </div>
        <h2 className="mb-2 font-display text-lg text-[#f4ecdd]">{title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-[#948a79]">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm text-[#cabfab] transition-colors hover:text-[#f4ecdd]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
              danger ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-[#cda45e] text-[#181109] hover:bg-[#e8c887]'
            }`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
