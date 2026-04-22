// app/negocio/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import PanelNegocio from "../../../../components/negocio/PanelNegocio.jsx";

export default function NegocioPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetchTurnos();
  }, []);

  async function fetchTurnos() {
    const { data, error } = await supabase
  .from("Turnos")
  .select(`
    idTurno,
    fecha_inicio,
    fecha_fin,
    Clientes (
      nombre
    )
  `)
  .eq("idNegocio", id);

    if (error) {
      console.log(error);
    } else {
      setTurnos(data);
    }
  }

  useEffect(() => {
    async function cargarNegocio() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Cargar el negocio y verificar que le pertenece al owner
      const { data, error } = await supabase
        .from("Negocios")
        .select("*")
        .eq("idNegocio", id)
        .eq("idDueño", user.id) 
        .single();

      if (error || !data) {
        setError("Negocio no encontrado");
      } else {
        setNegocio(data);
      }
      setLoading(false);
    }

    cargarNegocio();
  }, [id, router]);

  if (loading) return <div className="p-10">Cargando...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return <PanelNegocio negocio={negocio} turnos={turnos} />;
}