import '@/styles/globals.css'
import Header from '@/components/header/'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const showHeaderFooter = router.pathname !== '/login'

  return (
    <>
      {showHeaderFooter && <Header />}
      <Component {...pageProps} />
    </>
  )
}