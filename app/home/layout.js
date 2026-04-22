"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useContext, createContext } from "react";

export const HomeContext = createContext();

export function useHomeContext() {
  return useContext(HomeContext);
}

export default function HomeLayout({ children }) {
  const router = useRouter();
  const [rol, setRol] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      const currentSession = data.session;
      const rolUsuario = currentSession.user?.user_metadata?.rol;

      if (!rolUsuario) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setRol(rolUsuario);
      setLoading(false);
    }

    loadSession();
  }, [router]);

  if (loading || !session) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#0f6e56", borderTopColor: "transparent" }}
          />
          <p className="text-brand text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <HomeContext.Provider value={{ rol, session }}>
      {children}
    </HomeContext.Provider>
  );
}
