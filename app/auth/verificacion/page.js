"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const rol = session.user?.user_metadata?.rol;

        if (rol === "owner") {
          router.push("/crear-cuenta/owner");
        } else if (rol === "user") {
          router.push("/crear-cuenta/user");
        } else {
          router.push("/");
        }

        subscription.unsubscribe();
      } else if (event === "INITIAL_SESSION" && !session) {
        // Si después del evento inicial no hay sesión, algo falló
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#2563EB", borderTopColor: "transparent" }}
        />
        <p className="text-[#2563EB] text-lg ">Verificando cuenta...</p>
      </div>
    </div>
  );
}
