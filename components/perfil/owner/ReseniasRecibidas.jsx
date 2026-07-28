export default function ReseniasRecibidas({ reseñas = [], negocios = [] }) {
  const negociosMap = negocios.reduce((acc, negocio) => {
    acc[negocio.idNegocio] = negocio.nombre;
    return acc;
  }, {});

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
    <section className="bg-white rounded-xl w-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-display font-bold text-gray-900">
          Reseñas recibidas
        </h2>
        <p className="text-sm text-gray-500">{reseñas.length} reseñas</p>
      </div>

      {reseñas.length === 0 ? (
        <div className="px-6 py-10 text-sm text-center text-gray-500">
          Todavía no hay reseñas para tus negocios.
        </div>
      ) : (
        <div className="px-6 divide-y divide-gray-200">
          {reseñas.map((reseña) => (
            <div key={reseña.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {reseña.nombreCliente || "Cliente"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {negociosMap[reseña.idNegocio] || "Negocio desconocido"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-sm ${i <= (Number(reseña.rating) || 0) ? "text-brand" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                  {formatearFechaReseña(reseña.created_at)}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-3">{reseña.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
