export default function Pag2({ info, setInfo, prevPage, nextPage }) {
  const upsertHorario = (horarios, dia, data) => {
    const lista = Array.isArray(horarios) ? horarios : [];
    const existingIndex = lista.findIndex((h) => h?.dia === dia);

    if (existingIndex === -1) {
      return [...lista, { dia, ...data }];
    }

    return lista.map((h, i) =>
      i === existingIndex ? { ...h, dia, ...data } : h,
    );
  };

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
      {[...Array(7)].map((_, index) => {
        const horarioDia = info.negocio?.horarios?.find(
          (h) => h?.dia === index + 1,
        );

        return (
          <div
            key={index}
            className={`px-3 py-2 flex items-center gap-4 mb-3 ${!horarioDia?.activa ? "opacity-50" : "bg-brand-light/10 border border-brand/40 rounded-lg"}`}
          >
            <input
              type="checkbox"
              checked={horarioDia?.activa || false}
              onChange={() => {
                setInfo((prev) => ({
                  ...info,
                  negocio: {
                    ...prev.negocio,
                    horarios: upsertHorario(prev.negocio.horarios, index + 1, {
                      activa: !horarioDia?.activa,
                      desde: horarioDia?.desde || "",
                      hasta: horarioDia?.hasta || "",
                    }),
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
                value={horarioDia?.desde || "09:00"}
                onChange={(e) => {
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      horarios: upsertHorario(
                        prev.negocio.horarios,
                        index + 1,
                        {
                          activa: horarioDia?.activa || false,
                          desde: e.target.value,
                          hasta: horarioDia?.hasta || "",
                        },
                      ),
                    },
                  }));
                }}
                className="w-30 px-2 py-1 border bg-white border-brand/40 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">a</span>
              <input
                type="time"
                value={horarioDia?.hasta || "18:00"}
                onChange={(e) => {
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      horarios: upsertHorario(
                        prev.negocio.horarios,
                        index + 1,
                        {
                          activa:
                            prev.negocio.horarios?.find(
                              (h) => h?.dia === index + 1,
                            )?.activa || false,
                          desde:
                            prev.negocio.horarios?.find(
                              (h) => h?.dia === index + 1,
                            )?.desde || "",
                          hasta: e.target.value,
                        },
                      ),
                    },
                  }));
                }}
                className="w-30 px-2 py-1 border bg-white border-brand/40 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      })}
      <div className="mt-auto flex justify-between">
        <button
          onClick={prevPage}
          className="px-6 py-2 border border-brand text-brand cursor-pointer rounded-full hover:bg-gray-200 transition"
        >
          {"< Anterior"}
        </button>
        <button
          onClick={nextPage}
          className="px-6 py-2 bg-brand cursor-pointer text-white rounded-full hover:bg-brand/90 transition"
        >
          {"Siguiente >"}
        </button>
      </div>
    </div>
  );
}
