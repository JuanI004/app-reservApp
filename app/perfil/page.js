"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import PerfilCliente from "../../components/perfil/cliente/PerfilCliente";
import PerfilDueno from "../../components/perfil/owner/PerfilDueno";

export default function PerfilPage() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user info:", error);
      } else {
        console.log("User info:", data);
        setSession(data?.user);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      {session?.user_metadata?.rol === "user" && (
        <PerfilCliente session={session} />
      )}
      {session?.user_metadata?.rol === "owner" && (
        <PerfilDueno session={session} />
      )}
    </>
  );
}
