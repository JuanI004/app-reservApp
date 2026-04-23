"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { HomeContext } from "./context";

export default function Auth({ children }) {
  const router = useRouter();
  const [rol, setRol] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session) {
        router.replace("/login");
        return;
      }
      const currentSession = data.session;
      const rolUsuario = currentSession.user?.user_metadata?.rol;
      if (!rolUsuario) {
        router.replace("/login");
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
      <div className="w-screen h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#0f6e56", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <HomeContext.Provider value={{ rol, session }}>
      {children}
    </HomeContext.Provider>
  );
}
