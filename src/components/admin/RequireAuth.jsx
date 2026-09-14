import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'authed' : 'anon')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'anon')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0c] text-[#948a79]">
        Checking session&hellip;
      </div>
    )
  }

  if (status === 'anon') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
