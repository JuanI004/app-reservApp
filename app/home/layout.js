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
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        router.push("/login");
        return;
      }
      setSession(data.session);
      const rolUsuario = data.session.user?.user_metadata?.rol;
      if (!rolUsuario) {
        router.push("/login");
        return;
      }
      let nomTabla = "";
      if (rolUsuario === "owner") nomTabla = "Duenos";
      else if (rolUsuario === "user") nomTabla = "Usuarios";

      if (rolUsuario) setRol(rolUsuario);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#2563EB", borderTopColor: "transparent" }}
          />
          <p className="text-[#2563EB] text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  return (
    <HomeContext.Provider value={{ rol, session }}>
      <div>{children}</div>
    </HomeContext.Provider>
  );
}
