"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    setSession(null);
  }
  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setSession(null);
        return;
      }
      setSession(data.session);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        },
      );
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    handleCallback();
  }, []);
  return (
    <header className="fixed flex justify-between items-center top-0 w-screen bg-[#2563EB] text-white px-4 py-6">
      <h1 className="text-xl font-bold">ReservApp</h1>
      <ul className="flex gap-6">
        {session ? (
          <li>
            <button onClick={handleSignOut}>Cerrar Sesión</button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">Iniciar Sesion</Link>
            </li>
            <li>
              <Link href="/signup">Registrarse</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}
