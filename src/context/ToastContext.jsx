import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: WarningCircle,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (message, type = 'success') => {
      const id = ++idRef.current
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] ?? ICONS.info
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-lg backdrop-blur ${
                t.type === 'error'
                  ? 'border-red-500/30 bg-red-950/90 text-red-200'
                  : t.type === 'success'
                    ? 'border-[#cda45e]/30 bg-[#1b1815]/95 text-[#f4ecdd]'
                    : 'border-white/15 bg-[#1b1815]/95 text-[#cabfab]'
              }`}
            >
              <Icon size={18} weight="fill" className={t.type === 'error' ? 'text-red-400' : 'text-[#cda45e]'} />
              {t.message}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
