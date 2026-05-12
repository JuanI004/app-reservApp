"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase.js";
import NegocioOwnerPage from "../../../components/negocio/owner/NegocioOwnerPage";
import NegocioUserPage from "../../../components/negocio/user/NegocioUserPage";

export default function NegocioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rol, setRol] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [negocio, setNegocio] = useState(null);

  useEffect(() => {
    let active = true;

    async function cargarDatos() {
      try {
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
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        let negocioData = null;
        let negocioError = null;
        if (rolUsuario === "owner") {
          ({ data: negocioData, error: negocioError } = await supabase
            .from("Negocios")
            .select("*")
            .eq("idNegocio", id)
            .eq("idDueño", user.id)
            .single());
        } else {
          ({ data: negocioData, error: negocioError } = await supabase
            .from("Negocios")
            .select("*")
            .eq("idNegocio", id)
            .single());
        }
        if (!active) return;

        if (negocioError || !negocioData) {
          setError("Negocio no encontrado");
        } else {
          setNegocio(negocioData);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    cargarDatos();

    return () => {
      active = false;
    };
  }, [id, router]);

  if (rol === "owner")
    return <NegocioOwnerPage negocio={negocio} session={session} />;
  if (rol === "user")
    return <NegocioUserPage negocio={negocio} session={session} />;
}
