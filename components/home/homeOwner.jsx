// components/HomeOwner.jsx
"use client";

import Button from "../ui/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import NegociosOwner from "../NegociosOwner";
import { useCrearNegocioModal } from "../crearNegocio/CrearNegocioModalProvider";

export default function HomeOwner({ session }) {
  const router = useRouter();
  const { abrirCrearNegocio, refreshToken } = useCrearNegocioModal();
  const [loading, setLoading] = useState(true);
  const [negocios, setNegocios] = useState([]);
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
  }, [refreshToken]);

  const stats = [
    { label: "Negocios activos", cant: negocios.length },
    {
      label: "Turnos este mes",
      cant: 148,
      additionalInfo: { percentage: 12, sign: "+" },
    },
    { label: "Empleados", cant: 5, additionalInfo: "en todos los negocios" },
    {
      label: "Ingresos",
      cant: "$48k",
      additionalInfo: { percentage: 8, sign: "+" },
    },
  ];

  async function eliminarNegocio(idNegocio) {
    if (!idNegocio) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar tu negocio? Esta acción no se puede deshacer.",
    );
    if (!confirmacion) return;

    const { error } = await supabase
      .from("Negocios")
      .delete()
      .eq("idNegocio", idNegocio);

    if (error) {
      console.error("Error eliminando negocio:", error.message);
      return;
    }
    router.replace("/Home");
  }

  return (
    <>
      <div className="min-h-screen max-w-[1200px] mx-auto  pt-[105px] p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-[800] text-black">
              Mis Negocios
            </h1>
            <p className="text-gray-600">
              Gestioná todos tus negocios desde acá.
            </p>
          </div>
          <Button
            onClick={abrirCrearNegocio}
            className="px-5 py-2 cursor-pointer hover:bg-brand-light bg-brand text-white rounded-full hover:bg-brand-dark transition-colors"
          >
            + Nuevo negocio
          </Button>
        </div>

        <section className="grid grid-cols-2 gap-4 mt-10 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              className="bg-white p-4 border rounded-xl border-gray-200"
              key={index}
            >
              <h2 className="text-xs uppercase text-gray-500">{stat.label}</h2>
              <p className="font-display text-2xl font-[800] text-black">
                {stat.cant}
                {/* Placeholder, falta implementar lógica para contar turnos
                reales */}
              </p>
              {stat.additionalInfo && stat.additionalInfo.percentage ? (
                <p
                  className={`text-sm mt-1 ${
                    stat.additionalInfo.sign === "+"
                      ? "text-brand-light"
                      : "text-red-500"
                  }`}
                >
                  {stat.additionalInfo.sign}
                  {stat.additionalInfo.percentage}% vs mes anterior
                </p>
              ) : (
                stat.additionalInfo && (
                  <p className="text-sm mt-1 text-brand-light">
                    {stat.additionalInfo && ` ${stat.additionalInfo}`}
                  </p>
                )
              )}
            </div>
          ))}
        </section>
        {loading ? (
          <p className="text-center text-gray-500 mt-10">
            Cargando negocios...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : negocios.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No tenés negocios creados. ¡Empezá creando el tuyo!
          </p>
        ) : (
          <NegociosOwner
            negocios={negocios}
            handleDeleteNegocio={eliminarNegocio}
          />
        )}
      </div>
    </>
  );
}
