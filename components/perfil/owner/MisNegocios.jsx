import Image from "next/image";

export default function MisNegocios({ negocios = [], onNuevoNegocio }) {
  return (
    <section className="bg-white rounded-xl w-full overflow-hidden">
      <div className="flex items-center justify-between px-6   py-4 border-b border-gray-200 ">
        <h2 className="flex items-center text-lg font-display font-bold text-gray-900 ">
          Mis negocios
        </h2>
        <button
          onClick={onNuevoNegocio}
          className="text-sm font-medium cursor-pointer text-brand hover:text-brand transition-colors "
        >
          + Nuevo negocio
        </button>
      </div>

      {negocios.length > 0 ? (
        <div>
          {negocios.map((negocio) => {
            const meta =
              [negocio.categoria, negocio.direccion.split(",").slice(-1)[0]]
                .filter(Boolean)
                .join(" · ") ||
              negocio.descripcion ||
              "";
            const initials =
              (negocio.nombre || "")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "NB";
            const turnosHoy = negocio.turnosHoy || 0;

            return (
              <div
                key={negocio.idNegocio || negocio.id || negocio.nombre}
                className="flex items-center transition-all cursor-pointer hover:bg-background  justify-between px-6 py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-none">
                    {negocio.image_url ? (
                      <Image
                        src={negocio.image_url}
                        alt={negocio.nombre}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-lg font-semibold text-brand-700">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base truncate">
                        {negocio.nombre}
                      </h3>
                    </div>
                    {meta ? (
                      <p className="text-sm text-gray-500 truncate">{meta}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-end flex-none">
                  <span className="text-xl font-bold text-gray-800">
                    {turnosHoy}
                  </span>
                  <span className="text-sm text-gray-500">turnos hoy</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No tienes negocios registrados.
        </div>
      )}
    </section>
  );
}
