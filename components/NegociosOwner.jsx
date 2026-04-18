"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function NegociosOwner() {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNegocios() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("No hay usuario autenticado");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Negocios")
        .select("*")
        .eq("idDueño", user.id); 

      if (error) {
        setError(error.message);
      } else {
        setNegocios(data);
      }

      setLoading(false);
    }

    fetchNegocios();
  }, []);

  if (loading) return <p>Cargando negocios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (negocios.length === 0) {
    return <p>No tenés negocios creados todavía.</p>;
  }

  return (
    <div className="grid gap-4 mt-6">
      {negocios.map((negocio) => (
        <Link href={`/owner/negocio/${negocio.idNegocio}`} key={negocio.idNegocio}>
          <div
            key={negocio.idNegocio}
            className="p-4 bg-white rounded-lg shadow-md flex gap-4 items-center"
          >
            {negocio.image_url && (
              <img
                src={negocio.image_url}
                alt={negocio.nombre}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}

            <div>
              <h2 className="text-lg font-bold text-black">
                {negocio.nombre || "Sin nombre"}
              </h2>
              <p className="text-gray-500">
                {negocio.direccion || negocio.Ubicacion}
              </p>
              <p className="text-sm text-gray-400">
                {negocio.telefono || "Sin teléfono"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}