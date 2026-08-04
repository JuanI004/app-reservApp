import Image from "next/image";
import { useMemo, useState } from "react";
import {
  MONTHS_SHORT_ES,
  parseTurnoDateTime,
  getEstadoBadgeClass,
} from "../../../lib/turnos";
import Paginacion from "../../ui/Paginacion";

const TURNOS_POR_PAGINA = 5;

export default function MisTurnosDuenio({ turnos = [] }) {
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);

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

  const totalPaginas = Math.max(
    1,
    Math.ceil(turnosFiltrados.length / TURNOS_POR_PAGINA),
  );
  const paginaSegura = Math.min(pagina, totalPaginas);
  const turnosPagina = turnosFiltrados.slice(
    (paginaSegura - 1) * TURNOS_POR_PAGINA,
    paginaSegura * TURNOS_POR_PAGINA,
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
              onClick={() => {
                setFiltro(tab.label);
                setPagina(1);
              }}
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
          turnosPagina.map((turno) => {
            const fechaTurno = parseTurnoDateTime(turno);
            const day = Number.isNaN(fechaTurno.getTime())
              ? "-"
              : fechaTurno.getDate();
            const month = Number.isNaN(fechaTurno.getTime())
              ? "---"
              : MONTHS_SHORT_ES[fechaTurno.getMonth()];

            const negocioNombre = turno.nombreNegocio || "Negocio desconocido";
            const clienteNombre = turno.nombreCliente || "Cliente desconocido";

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
                        <div className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                          {clienteNombre?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="truncate text-xs">
                          {clienteNombre}
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
      <Paginacion
        pagina={paginaSegura}
        totalPaginas={totalPaginas}
        onCambiar={setPagina}
      />
    </section>
  );
}
