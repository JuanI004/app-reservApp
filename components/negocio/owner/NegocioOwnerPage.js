// app/negocio/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import PanelNegocio from "./PanelNegocio.jsx";

export default function NegocioOwnerPage({ negocio, session }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetchTurnos();
    setLoading(false);
  }, []);

  async function fetchTurnos() {
    const { data, error } = await supabase
      .from("Turnos")
      .select(
        `
    idTurno,
    fecha_inicio,
    fecha_fin,
    Clientes (
      nombre
    )
  `,
      )
      .eq("idNegocio", negocio?.idNegocio);

    if (error) {
      console.log(error);
    } else {
      setTurnos(data);
    }
  }

  if (loading) return <div className="p-10 mt-20">Cargando...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return <PanelNegocio negocio={negocio} turnos={turnos} />;
}
