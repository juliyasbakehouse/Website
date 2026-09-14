import { LockKey } from '@phosphor-icons/react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    setSignedIn(true)
  }

  if (signedIn) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0c] px-6 text-[#f4ecdd]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-[#131210] p-8 shadow-2xl shadow-black/40"
      >
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#cda45e]/12 text-[#cda45e]">
          <LockKey size={20} weight="bold" />
        </span>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#cda45e]">Bakehouse</p>
        <h1 className="mb-6 font-display text-2xl">Admin sign in</h1>

        <label className="mb-4 block text-sm">
          <span className="mb-1.5 block text-[#cabfab]">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#1b1815] px-3.5 py-2.5 text-[#f4ecdd] outline-none transition-colors focus:border-[#cda45e]/60"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1.5 block text-[#cabfab]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#1b1815] px-3.5 py-2.5 text-[#f4ecdd] outline-none transition-colors focus:border-[#cda45e]/60"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#cda45e] py-2.5 text-sm font-semibold text-[#181109] transition-colors hover:bg-[#e8c887] disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
