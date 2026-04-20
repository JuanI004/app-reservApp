export default function Pag2({ info, setInfo, prevPage, nextPage }) {
  return (
    <div className="w-full h-full flex flex-col z-10">
      <h2 className="text-xl text-gray-600 font-display font-bold ">
        Datos de tu negocio
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Configurá los días y horarios en que tu negocio atiende.
      </p>
      <h3 className="text-sm text-gray-700 tracking-widest uppercase mb-2">
        Días y franjas horarias
      </h3>
      {[...Array(7)].map((_, index) => (
        <div key={index} className="flex items-center gap-4 mb-3">
          <input
            type="checkbox"
            onClick={() => {
              setInfo((prev) => ({
                ...info,
                negocio: {
                  ...prev.negocio,
                  horarios: [
                    ...(prev.negocio.horarios || []),
                    {
                      dia: index,
                      activa: !prev.negocio.horarios?.[index]?.activa,
                      desde: prev.negocio.horarios?.[index]?.desde || "",
                      hasta: prev.negocio.horarios?.[index]?.hasta || "",
                    },
                  ],
                },
              }));
            }}
            id={`dia-${index}`}
            className="w-4 h-4 accent-brand bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-brand transition"
          />
          <label htmlFor={`dia-${index}`} className="text-gray-700">
            {
              [
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ][index]
            }
          </label>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="time"
              value={info.negocio?.horarios?.[index]?.desde || ""}
              onChange={(e) => {
                setInfo((prev) => ({
                  ...info,
                  negocio: {
                    ...prev.negocio,
                    horarios: [
                      ...(prev.negocio.horarios || []),
                      {
                        dia: index,
                        activa: prev.negocio.horarios?.[index]?.activa || false,
                        desde: e.target.value,
                        hasta: prev.negocio.horarios?.[index]?.hasta || "",
                      },
                    ],
                  },
                }));
              }}
              className="w-30 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">a</span>
            <input
              type="time"
              value={info.negocio?.horarios?.[index]?.hasta || ""}
              onChange={(e) => {
                setInfo((prev) => ({
                  ...info,
                  negocio: {
                    ...prev.negocio,
                    horarios: [
                      ...(prev.negocio.horarios || []),
                      {
                        dia: index,
                        activa: prev.negocio.horarios?.[index]?.activa || false,
                        desde: prev.negocio.horarios?.[index]?.desde || "",
                        hasta: e.target.value,
                      },
                    ],
                  },
                }));
              }}
              className="w-30 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
      <div className="mt-auto flex justify-between">
        <button
          onClick={prevPage}
          className="px-4 py-2 border border-brand text-brand cursor-pointer rounded hover:bg-gray-200 transition"
        >
          Anterior
        </button>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-brand cursor-pointer text-white rounded hover:bg-brand/90 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
