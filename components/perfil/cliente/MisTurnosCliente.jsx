import Image from "next/image";
import { useMemo, useState } from "react";

const MONTHS_SHORT_ES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

function parseTurnoDateTime(turno) {
  const fechaStr = turno?.fecha ?? turno?.fecha_inicio ?? "";
  const horaStr = turno?.horaInicio ?? "00:00";

  if (!fechaStr) return new Date(0);

  if (typeof fechaStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-").map(Number);
    const [h, min] = horaStr.split(":").map((v) => Number(v || 0));
    return new Date(y, m - 1, d, h, min);
  }

  const parsed = new Date(fechaStr);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return new Date(0);
}

function getEstadoBadgeClass(estado) {
  if (estado === "confirmado")
    return "bg-green-100 text-green-700 border-green-300";
  if (estado === "pendiente")
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (estado === "completado")
    return "bg-blue-100 text-blue-700 border-blue-300";
  if (estado === "cancelado") return "bg-red-100 text-red-700 border-red-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
}

export default function MisTurnosCliente({
  turnos = [],
  personalTurnos = {},
  negociosTurnos = {},
}) {
  const [filtro, setFiltro] = useState("Todos");

  const turnosOrdenados = useMemo(() => {
    return [...turnos].sort(
      (a, b) =>
        parseTurnoDateTime(a).getTime() - parseTurnoDateTime(b).getTime(),
    );
  }, [turnos]);

  const ahora = new Date();

  const filtros = {
    Todos: (turno) => Boolean(turno),
    Proximos: (turno) => {
      const fechaTurno = parseTurnoDateTime(turno);
      return (
        fechaTurno >= ahora &&
        turno.estado !== "cancelado" &&
        turno.estado !== "completado"
      );
    },
    Completados: (turno) => turno.estado === "completado",
    Cancelados: (turno) => turno.estado === "cancelado",
  };

  const tabs = [
    {
      label: "Todos",
      cantidad: turnosOrdenados.length,
    },
    {
      label: "Proximos",
      cantidad: turnosOrdenados.filter(filtros.Proximos).length,
    },
    {
      label: "Completados",
      cantidad: turnosOrdenados.filter(filtros.Completados).length,
    },
    {
      label: "Cancelados",
      cantidad: turnosOrdenados.filter(filtros.Cancelados).length,
    },
  ];

  const turnosFiltrados = turnosOrdenados.filter(
    filtros[filtro] ?? filtros.Todos,
  );

  return (
    <section className="bg-white rounded-xl w-full overflow-hidden">
      <h2 className="flex items-center text-lg font-display font-bold text-gray-900 px-6 py-4 border-b border-gray-200">
        Mis turnos
      </h2>
      <div className="bg-background px-6 py-3 border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setFiltro(tab.label)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                filtro === tab.label
                  ? "bg-white text-brand shadow-sm border border-gray-200"
                  : "text-gray-600 hover:bg-white/70"
              }`}
            >
              <span>{tab.label}</span>
              {tab.cantidad > 0 && (
                <span className="bg-[#E24B4A] text-white text-xs font-semibold px-2 py-0.5 rounded-full leading-none">
                  {tab.cantidad}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {turnosFiltrados.length === 0 ? (
          <div className="px-6 py-10 text-sm text-center text-gray-500">
            No hay turnos para este filtro.
          </div>
        ) : (
          turnosFiltrados.map((turno) => {
            const fechaTurno = parseTurnoDateTime(turno);
            const day = Number.isNaN(fechaTurno.getTime())
              ? "-"
              : fechaTurno.getDate();
            const month = Number.isNaN(fechaTurno.getTime())
              ? "---"
              : MONTHS_SHORT_ES[fechaTurno.getMonth()];

            const negocioNombre =
              negociosTurnos[turno.idNegocio]?.nombre || "Negocio desconocido";
            const empleado = personalTurnos[turno.idEmpleado];

            return (
              <article
                key={turno.idTurno}
                className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 shrink-0 border-r border-gray-200 pr-3 text-center leading-tight">
                    <p className="font-display text-2xl font-bold text-gray-900">
                      {day}
                    </p>
                    <p className="text-xs tracking-wide text-gray-500">
                      {month}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {negocioNombre}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {turno.servicio || "Servicio"}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 min-w-0">
                      <span>
                        {turno.horaInicio?.slice(0, 5) || "--:--"} -{" "}
                        {turno.horaFin?.slice(0, 5) || "--:--"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 min-w-0">
                        {empleado?.image_url ? (
                          <Image
                            src={empleado.image_url}
                            alt={empleado.nombre || "Empleado"}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                            {empleado?.nombre?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="truncate text-xs">
                          {empleado?.nombre || "Empleado desconocido"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 capitalize px-3 py-1 rounded-full border text-xs font-medium ${getEstadoBadgeClass(
                    turno.estado,
                  )}`}
                >
                  {turno.estado || "sin estado"}
                </span>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
