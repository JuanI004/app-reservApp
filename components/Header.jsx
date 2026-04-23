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
      console.log("Sesión obtenida:", data.session);
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
    <header className="fixed left-1/2 shadow-xl -translate-x-1/2 max-w-[820px] w-full rounded-[100px]  flex justify-between items-center top-5  bg-brand text-white px-4 py-3 z-20">
      <h1
        className="text-2xl font-display font-[700] cursor-pointer"
        onClick={() => router.push("/")}
      >
        Reserv<span className="text-[#9FE1CB]">App</span>
      </h1>
      <ul className="flex gap-6 items-center">
        {session ? (
          <li className="hover:bg-brand-light/60 cursor-pointer py-2 px-4 rounded-full transition-all ">
            <button onClick={handleSignOut}>Cerrar Sesión</button>
          </li>
        ) : (
          <>
            <li className="hover:bg-brand-light/60 py-2 px-4 rounded-full transition-all ">
              <Link href="/login">Entrar</Link>
            </li>
            <li className="bg-white text-brand py-2 px-4 rounded-full font-medium hover:bg-[#d1faf0] hover:scale-105 transition-all">
              <Link href="/signup">Empezar gratis</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}
