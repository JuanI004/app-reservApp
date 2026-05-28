export default function CalendarioSem({ turnos = [] }) {
  const turnosSemana = turnos.filter((turno) => {
    const fechaTurno = new Date(turno.fecha);
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    return fechaTurno >= inicioSemana && fechaTurno <= finSemana;
  });
  const diaMasOcupado = turnosSemana.reduce((diaMasOcupado, turno) => {
    const fechaTurno = new Date(turno.fecha);
    const diaSemana = fechaTurno.getDay();
    if (!diaMasOcupado || diaSemana.cantTurnos > diaMasOcupado.cantTurnos) {
      return {
        dia: diaSemana,
        cantTurnos: (diaMasOcupado?.cantTurnos || 0) + 1,
      };
    }
    return diaMasOcupado;
  }, null);
  const turnosPendientes = turnosSemana.filter((t) => t.estado === "pendiente");
  const turnosConfirmados = turnosSemana.filter(
    (t) => t.estado === "confirmado",
  );
  const TABS = [
    {
      label: "Esta semana",
      value: turnosSemana.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
        </svg>
      ),
      extra: `turnos totales`,
      color: "#1d9e75",
    },
    {
      label: "Confirmados",
      value: turnosConfirmados.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      ),
      extra: "↑ 12% vs mes anterior",
      color: "#1d9e75",
    },
    {
      label: "Pendientes",
      value: turnosPendientes.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#D97706"
          viewBox="0 0 256 256"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
        </svg>
      ),
      extra: "Requieren confirmación",
      color: "#D97706",
    },
    {
      label: "Mejor Dia",
      value: diaMasOcupado
        ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][diaMasOcupado.dia]
        : "N/A",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#2563EB"
          viewBox="0 0 256 256"
        >
          <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"></path>
        </svg>
      ),
      extra: diaMasOcupado
        ? `${diaMasOcupado.cantTurnos} turnos`
        : "Sin turnos esta semana",
      color: "#2563EB",
    },
  ];
  return (
    <>
      {" "}
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
    </>
  );
}
