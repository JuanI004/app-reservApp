"use client";

import { useRouter } from "next/navigation";

export default function NegociosOwner({ negocios, handleDeleteNegocio }) {
  const router = useRouter();

  if (!negocios || negocios.length === 0) {
    return <p className="text-gray-600">No tenés negocios creados todavía.</p>;
  }

  return (
    <div className="grid gap-6 mt-6 grid-cols-1 md:grid-cols-2">
      {negocios.map((negocio, idx) => (
        <>
          <article className="bg-white  rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`px-4 py-8 flex items-center bg-black `}>
              <div className="flex-shrink-0 ">
                {negocio.image_url ? (
                  <img
                    src={negocio.image_url}
                    alt={negocio.nombre}
                    className="w-20 h-20 object-cover rounded-xl border-4 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-600">
                    {negocio.nombre ? negocio.nombre.charAt(0) : "N"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex-1 w-full ">
                <div className="flex justify-between p-4 items-start">
                  <div>
                    <h2 className="text-xl font-display font-[700] text-gray-900">
                      {negocio.nombre || "Sin nombre"}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {negocio.categoria || "Categoría no definida"} ·{" "}
                      {negocio.direccion ||
                        negocio.Ubicacion ||
                        "Ubicación no disponible"}
                    </p>
                    <div className="flex items-center gap-1">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#99a1af"
                        viewBox="0 0 256 256"
                        className="mt-1"
                      >
                        <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                      </svg>
                      <p className="text-sm text-gray-400 mt-1">
                        {negocio.telefono || "Sin teléfono"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-brand border border-brand bg-brand-light/20 px-3 py-1 rounded-full">
                    Abierto
                  </span>
                </div>

                <div className="  rounded-xl px-4 grid grid-cols-3 gap-3 text-center text-sm text-gray-700">
                  <div className="py-4 bg-background rounded-lg ">
                    <div className="text-xl font-display font-[700]">84</div>
                    <div className="text-xs text-gray-400">Turnos mes</div>
                  </div>
                  <div className="py-4 bg-background rounded-lg ">
                    <div className="text-xl font-display font-[700]">6</div>
                    <div className="text-xs text-gray-400">Hoy</div>
                  </div>
                  <div className="py-4 bg-background rounded-lg ">
                    <div className="text-xl font-display font-[700]">4.9</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>

                <div className="mt-4 border-t border-t-gray-300 bg-background w-full p-4 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteNegocio(negocio.idNegocio)}
                      className="px-3 py-2  bg-white border rounded-full text-sm text-red-600 hover:bg-red-300/15 cursor-pointer shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="oklch(57.7% 0.245 27.325)"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => router.push(`/negocio/${negocio.idNegocio}`)}
                    className="ml-auto cursor-pointer px-5 py-2 bg-brand text-white text-sm rounded-full shadow hover:bg-emerald-700"
                  >
                    Ver negocio
                  </button>
                </div>
              </div>
            </div>
          </article>
        </>
      ))}
    </div>
  );
}
