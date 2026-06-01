import EstadoTurnos from "./EstadoTurnos.jsx";
import ActividadMes from "./ActividadMes";

export default function Estadisticas({ turnos, negocio, personalTurnos }) {
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date(dateStr);
    const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    if (isoDateOnly) {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
  };

  const turnosMes = turnos.filter((t) => {
    const turnoDate = parseLocalDate(t.fecha);
    const now = new Date();
    return (
      turnoDate.getMonth() === now.getMonth() &&
      turnoDate.getFullYear() === now.getFullYear()
    );
  });
  console.log("Turnos del mes:", turnosMes);
  const facturacion = turnosMes.reduce((total, turno) => {
    if (turno.estado !== "completado") return total;
    const servicio = negocio.servicios.find((s) => s.nombre === turno.servicio);
    return total + (servicio ? parseFloat(servicio.precio) : 0);
  }, 0);
  const parsearFacturacion = (num) => {
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  };
  const turnosCancelados = turnosMes.filter((t) => t.estado === "cancelado");
  const TABS = [
    {
      label: "Mes actual",
      value: turnosMes.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z"></path>
        </svg>
      ),
      extra: `↑ 12% vs mes anterior`,
      color: "#1d9e75",
    },
    {
      label: "Facturacion",
      value: parsearFacturacion(facturacion),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
        </svg>
      ),
      extra: "↑ 12% vs mes anterior",
      color: "#1d9e75",
    },

    {
      label: "Cancelaciones",
      value: turnosCancelados.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#e24b4a"
          viewBox="0 0 256 256"
        >
          <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
        </svg>
      ),
      extra: "este mes",
      color: "#e24b4a",
    },
    {
      label: "Rating",
      value: 4.9,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#D97706"
          viewBox="0 0 256 256"
        >
          <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"></path>
        </svg>
      ),
      extra: "128 reseñas",
      color: "#D97706",
    },
  ];

  const turnosPorEmpleado = Object.entries(personalTurnos).map(
    ([idEmpleado, persona]) => ({
      idEmpleado,
      persona,
      cantidad: turnosMes.filter(
        (turno) => String(turno.idEmpleado) === String(idEmpleado),
      ).length,
    }),
  );
  console.log("Turnos por empleado:", turnosPorEmpleado);
  return (
    <>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TABS.map((tab) => (
          <div
            key={tab.label}
            className="bg-white rounded-xl  mt-5 p-4 flex items-center gap-4 "
          >
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs uppercase text-gray-500">{tab.label}</p>
                <span
                  className="p-2 bg rounded-xl"
                  style={{
                    backgroundColor: `${tab.color}20`,
                    color: tab.color,
                  }}
                >
                  {tab.icon}
                </span>
              </div>

              <p className="text-2xl font-display font-extrabold text-gray-900">
                {tab.value}
              </p>
              {tab.extra && (
                <p className="text-xs text-brand-light mt-1">{tab.extra}</p>
              )}
            </div>
          </div>
        ))}
      </section>
      <main className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl ">
          <h2 className="text-lg font-display font-bold pt-5 pb-4 px-6 border-b border-gray-200 ">
            Servicios más solicitados
          </h2>
          <div className="px-6 py-4 w-full">
            {(() => {
              const servicios = negocio?.servicios ?? [];
              const serviciosConCount = servicios.map((s) => {
                const c = turnos.filter((t) => t.servicio === s.nombre).length;
                return { ...s, count: c };
              });
              const maxCount = Math.max(
                1,
                ...serviciosConCount.map((s) => s.count),
              );
              return serviciosConCount
                .sort((a, b) => b.count - a.count)
                .map((servicio) => {
                  if (servicio.count === 0) return null;
                  return (
                    <div
                      key={servicio.id || servicio.nombre}
                      className="grid grid-cols-[1fr_2fr_0.1fr] gap-4 py-2"
                    >
                      <p className="text-sm text-gray-700">{servicio.nombre}</p>
                      <div className="relative bg-background rounded-full h-2 w-full ">
                        <span
                          className="absolute top-0 left-0 h-full bg-brand rounded-full"
                          style={{
                            width: `${(servicio.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-medium text-gray-900">
                        {servicio.count}
                      </span>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
        <div className="bg-white rounded-xl ">
          <h2 className="text-lg font-display font-bold pt-5 pb-4 px-6 border-b border-gray-200 ">
            Estado de turnos
          </h2>
          <div className="flex justify-center items-center px-6  py-4">
            <EstadoTurnos turnos={turnosMes} />
          </div>
        </div>
        <div className="bg-white rounded-xl ">
          <h2 className="text-lg font-display font-bold pt-5 pb-4 px-6 border-b border-gray-200 ">
            Turnos por empleado
          </h2>
          <div className="px-6 py-4 w-full">
            {turnosPorEmpleado.map(({ idEmpleado, persona, cantidad }) => (
              <div
                key={idEmpleado}
                className="grid grid-cols-[1fr_2fr_0.1fr] items-center gap-4 py-2"
              >
                <p className="text-sm text-gray-700">{persona?.nombre}</p>
                <div className="relative bg-background rounded-full h-2 w-full ">
                  <span
                    className="absolute top-0 left-0 h-full bg-[#D85A30] rounded-full"
                    style={{
                      width: `${(cantidad / Math.max(...turnosPorEmpleado.map((t) => t.cantidad))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {cantidad}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl ">
          <h2 className="text-lg font-display font-bold pt-5 pb-4 px-6 border-b border-gray-200 ">
            Actividad del mes
          </h2>
          <div className="px-6 py-4 w-full flex justify-center">
            <ActividadMes turnos={turnosMes} />
          </div>
        </div>
      </main>
    </>
  );
}
