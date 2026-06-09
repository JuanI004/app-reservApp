import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function MisReseñasCliente({ reseñas = [] }) {
  console.log("Reseñas recibidas en MisReseñasCliente:", reseñas);

  const [negociosMap, setNegociosMap] = useState({});

  useEffect(() => {
    async function fetchNegocios() {
      const ids = [...new Set(reseñas.map((r) => r.idNegocio).filter(Boolean))];
      if (ids.length === 0) {
        setNegociosMap({});
        return;
      }

      const { data, error } = await supabase
        .from("Negocios")
        .select("idNegocio, nombre")
        .in("idNegocio", ids);

      if (error) {
        console.error("Error fetching negocios for reseñas:", error);
      } else {
        const map = (data ?? []).reduce((acc, n) => {
          acc[n.idNegocio] = n.nombre;
          return acc;
        }, {});
        setNegociosMap(map);
      }
    }

    fetchNegocios();
  }, [reseñas]);

  function formatearFechaReseña(fechaStr) {
    if (!fechaStr) return "";
    let s = String(fechaStr).trim();
    s = s.replace(" ", "T");
    s = s.replace(/\+00(:00)?$/, "Z");
    s = s.replace(/\.(\d{3})\d+/, ".$1");
    let fecha = new Date(s);
    if (isNaN(fecha)) {
      const fallback = String(fechaStr).split(".")[0].replace(" ", "T");
      fecha = new Date(fallback);
    }

    return isNaN(fecha) ? "" : fecha.toLocaleDateString();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center py-4 px-6 border-b border-gray-200 justify-between">
        <h2 className="font-display text-lg font-[700]">Mis reseñas</h2>
        <p className="text-sm text-gray-500">{reseñas?.length || 0} reseñas</p>
      </div>

      {reseñas && reseñas.length > 0 ? (
        <div className="px-6 divide-y divide-gray-200">
          {reseñas.map((reseña) => (
            <div key={reseña.id} className="py-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {negociosMap[reseña.idNegocio] ||
                      reseña.nombreNegocio ||
                      reseña.negocio ||
                      reseña.negocioNombre ||
                      reseña.nombre ||
                      reseña.nombreCliente}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`text-sm ${i <= (Number(reseña.rating) || 0) ? "text-brand" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatearFechaReseña(reseña.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right pl-4">
                  <p className="text-xs text-gray-400">
                    {formatearFechaReseña(reseña.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-3">{reseña.comentario}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          Aún no hay reseñas para este negocio.
        </p>
      )}
    </div>
  );
}
