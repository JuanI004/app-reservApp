import { useState } from "react";

const COLOR_PUNTO_ESTADO = {
  confirmado: "bg-brand-light",
  pendiente: "bg-[#D97706]",
  completado: "bg-blue-800",
  cancelado: "bg-red-800",
};

const BADGE_ESTADO = {
  confirmado: "bg-green-100 text-brand",
  pendiente: "bg-yellow-100 text-yellow-800",
  completado: "bg-blue-100 text-blue-800",
  cancelado: "bg-red-100 text-red-800",
};

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function Calendario({
  turnos,
  negocio,
  onConfirmar,
  onCancelar,
}) {
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();

  function getDiasSemana() {
    const hoy = new Date();
    const diaSemana = hoy.getDay();

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    lunes.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      return dia;
    });
  }
  function extraerHora(valor) {
    if (!valor) return null;

    const fecha = new Date(valor);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.getHours();
    }

    const horaTexto = String(valor).split(":")[0];
    const hora = Number.parseInt(horaTexto, 10);
    return Number.isNaN(hora) ? null : hora;
  }

  function fechaDelTurno(turno) {
    const fechaStr =
      turno.fecha ?? turno.fecha_inicio ?? turno.fechaInicio ?? null;
    const horaStr =
      turno.horaInicio ??
      turno.horainicio ??
      turno.hora ??
      turno.horaFin ??
      turno.hora_fin ??
      null;

    if (fechaStr && horaStr) {
      return new Date(`${fechaStr}T${horaStr}`);
    }
    if (fechaStr) {
      return new Date(fechaStr);
    }
    if (horaStr) {
      const today = new Date();
      const [h, m] = String(horaStr).split(":").map(Number);
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        Number.isFinite(h) ? h : 0,
        Number.isFinite(m) ? m : 0,
      );
    }
    return new Date();
  }

  function turnosDelSlot(dia, hora) {
    return turnos.filter((turno) => {
      const fechaTurno = fechaDelTurno(turno);
      return (
        fechaTurno.getDate() === dia.getDate() &&
        fechaTurno.getMonth() === dia.getMonth() &&
        fechaTurno.getHours() === hora
      );
    });
  }

  const horariosNegocio = Array.isArray(negocio?.horarios)
    ? negocio.horarios.filter((horario) => horario?.activa !== false)
    : [];
  const horasTurnos = turnos
    .map((turno) => extraerHora(turno?.fecha_inicio ?? turno?.hora))
    .filter((hora) => hora !== null);

  const horaMasTemprana = horariosNegocio.length
    ? Math.min(
        ...horariosNegocio
          .map((horario) => extraerHora(horario.desde))
          .filter((hora) => hora !== null),
      )
    : horasTurnos.length
      ? Math.min(...horasTurnos)
      : 8;
  const horaMasTardia = horariosNegocio.length
    ? Math.max(
        ...horariosNegocio
          .map((horario) => extraerHora(horario.hasta))
          .filter((hora) => hora !== null),
      )
    : horasTurnos.length
      ? Math.max(...horasTurnos)
      : 18;
  const horas = Array.from(
    { length: horaMasTardia - horaMasTemprana + 1 },
    (_, index) => horaMasTemprana + index,
  );
  const dias = getDiasSemana();

  function formatearHora(hora) {
    return `${String(hora).padStart(2, "0")}:00`;
  }

  const turnosModal = slotSeleccionado
    ? turnosDelSlot(slotSeleccionado.dia, slotSeleccionado.hora)
    : [];

  return (
    <main className="rounded-xl mt-4 overflow-hidden">
      <div className="flex p-4 bg-[#f7f6f3] border-b border-b-gray-200 justify-between items-center">
        <h2 className="font-display font-bold">
          {
            [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ][mesActual]
          }{" "}
          {fechaActual.getFullYear()}
        </h2>
      </div>
      <div className="grid grid-cols-[4.25rem_repeat(7,minmax(0,1fr))] bg-[#f7f6f3] border-b border-b-gray-200">
        <div className="p-2 text-center text-sm border-x border-x-gray-200 font-medium text-gray-500"></div>
        {dias.map((dia, idx) => (
          <div
            key={idx}
            className={`p-2 text-center border-r border-r-gray-200 flex flex-col text-sm font-medium ${
              dia.getDate() === fechaActual.getDate() &&
              dia.getMonth() === fechaActual.getMonth()
                ? "bg-brand/10 text-brand "
                : "text-gray-500"
            }`}
          >
            <p>{DIAS_CORTOS[dia.getDay()]} </p>
            <h3 className="font-display leading-tight font-extrabold text-lg">
              {dia.getDate()}
            </h3>
          </div>
        ))}
      </div>
      <section className="grid grid-cols-[4.25rem_repeat(7,minmax(0,1fr))] bg-white">
        {horas.map((hora) => (
          <div key={hora} className="contents ">
            <div className="flex flex-wrap  justify-center items-center border-x border-b border-gray-200 bg-[#f7f6f3] p-2 text-xs font-medium text-gray-500">
              {formatearHora(hora)}
            </div>

            {dias.map((dia) => {
              const turnosCelda = turnosDelSlot(dia, hora);
              return (
                <div
                  key={`${dia.toISOString()}-${hora}`}
                  onClick={() =>
                    turnosCelda.length > 0 &&
                    setSlotSeleccionado({ dia, hora })
                  }
                  className={`min-h-14 ${turnosCelda.length > 0 ? "cursor-pointer hover:bg-brand/10" : ""} ${dia.getDate() === fechaActual.getDate() && dia.getMonth() === fechaActual.getMonth() ? "bg-brand/5" : ""} flex justify-center items-center border-r border-b border-gray-200 gap-1 p-2`}
                >
                  {turnosCelda.map((turno) => (
                    <span
                      key={turno.idTurno}
                      className={`h-2.5 w-2.5 rounded-full ${
                        COLOR_PUNTO_ESTADO[turno.estado] ?? "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      {slotSeleccionado && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSlotSeleccionado(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-display font-bold">
                {DIAS_CORTOS[slotSeleccionado.dia.getDay()]}{" "}
                {slotSeleccionado.dia.getDate()} ·{" "}
                {formatearHora(slotSeleccionado.hora)}
              </h3>
              <button
                type="button"
                onClick={() => setSlotSeleccionado(null)}
                aria-label="Cerrar"
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {turnosModal.length === 0 ? (
                <p className="px-6 py-8 text-sm text-center text-gray-500">
                  No hay turnos en este horario.
                </p>
              ) : (
                turnosModal.map((turno) => (
                  <div key={turno.idTurno} className="px-6 py-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${
                          BADGE_ESTADO[turno.estado] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {turno.estado || "sin estado"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {turno.horaInicio?.slice(0, 5) || "--:--"} -{" "}
                        {turno.horaFin?.slice(0, 5) || "--:--"}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="text-gray-500">Cliente:</span>{" "}
                      {turno.nombreCliente || "—"}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Empleado:</span>{" "}
                      {turno.nombreEmpleado || "—"}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Servicio:</span>{" "}
                      {turno.servicio || "—"}
                    </p>
                    {turno.estado === "pendiente" && (
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => onConfirmar?.(turno.idTurno)}
                          className="flex-1 text-sm px-3 py-1.5 rounded-full bg-brand text-white hover:bg-brand-dark transition-colors cursor-pointer"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancelar?.(turno.idTurno)}
                          className="flex-1 text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
