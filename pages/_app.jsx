import "@/styles/globals.css";
import Header from "@/components/header/";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function App({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const showHeaderFooter =
    router.pathname !== "/login" && router.pathname !== "/register";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const session = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      setSession(session);
    };
    session();
  }, []);

  return (
    <>
      {showHeaderFooter && <Header session={session} supabase={supabase} />}
      <Component {...pageProps} session={session} supabase={supabase} />
    </>
  );
}
