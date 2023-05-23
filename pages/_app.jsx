import '@/styles/globals.css'
import Header from '@/components/header/'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()
  const showHeaderFooter = router.pathname !== '/login' && router.pathname !== '/register'

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      {showHeaderFooter && <Header />}
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}