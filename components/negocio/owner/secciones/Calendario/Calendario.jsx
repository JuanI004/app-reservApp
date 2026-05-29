import { useState } from "react";

export default function Calendario({ turnos, negocio }) {
  const [mostrarDetalle, setMostrarDetalle] = useState(null);
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
  console.log(mostrarDetalle);

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
            <p>
              {
                ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dia.getDay()]
              }{" "}
            </p>
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

            {dias.map((dia) => (
              <div
                key={`${dia.toISOString()}-${hora}`}
                className={`group min-h-14 cursor-pointer hover:bg-brand/10 ${dia.getDate() === fechaActual.getDate() && dia.getMonth() === fechaActual.getMonth() ? "bg-brand/5" : ""} flex justify-center items-center border-r border-b border-gray-200 p-2`}
              >
                {turnos
                  .filter((turno) => {
                    const fechaStr =
                      turno.fecha ??
                      turno.fecha_inicio ??
                      turno.fechaInicio ??
                      null;
                    const horaStr =
                      turno.horaInicio ??
                      turno.horainicio ??
                      turno.hora ??
                      turno.horaFin ??
                      turno.hora_fin ??
                      null;

                    let fechaTurno;
                    if (fechaStr && horaStr) {
                      fechaTurno = new Date(`${fechaStr}T${horaStr}`);
                    } else if (fechaStr) {
                      fechaTurno = new Date(fechaStr);
                    } else if (horaStr) {
                      const today = new Date();
                      const [h, m] = String(horaStr).split(":").map(Number);
                      fechaTurno = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate(),
                        Number.isFinite(h) ? h : 0,
                        Number.isFinite(m) ? m : 0,
                      );
                    } else {
                      fechaTurno = new Date();
                    }

                    return (
                      fechaTurno.getDate() === dia.getDate() &&
                      fechaTurno.getMonth() === dia.getMonth() &&
                      fechaTurno.getHours() === hora
                    );
                  })
                  .map((turno) => (
                    <div
                      onMouseEnter={() => setMostrarDetalle(turno.idTurno)}
                      onMouseLeave={() => setMostrarDetalle(null)}
                      key={turno.idTurno}
                      className={`relative bg-white border-5 ${turno.estado === "confirmado" ? "border-brand-light" : turno.estado === "pendiente" ? "border-[#D97706]" : "border-red-800"} cursor-pointer h-5 w-5 rounded-full p-1 text-xs font-medium group-hover:scale-110 transition-transform `}
                    >
                      {mostrarDetalle != null && (
                        <div className="absolute z-20 -top-30 w-[150px] bg-white border border-gray-300 flex flex-col gap-2 items-start rounded-lg shadow-lg p-4">
                          <h4
                            className={`rounded-xl px-3 border ${turno.estado === "confirmado" ? "bg-green-100 text-brand border-brand" : turno.estado === "pendiente" ? "bg-yellow-100 text-yellow-800 border-yellow-800" : "bg-red-100 text-red-800 border-red-800"} capitalize`}
                          >
                            {turno.estado}
                          </h4>
                          <p>Cliente: {turno.nombreCliente}</p>
                          <p>Empleado: {turno.nombreEmpleado}</p>
                          <p>
                            {turno.horaInicio.split(":")[0]}:
                            {turno.horaInicio.split(":")[1]} →{" "}
                            {turno.horaFin.split(":")[0]}:
                            {turno.horaFin.split(":")[1]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
