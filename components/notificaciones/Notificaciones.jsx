function formatearTiempoRelativo(fechaStr) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "";

  const diffMin = Math.floor((Date.now() - fecha.getTime()) / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;

  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `hace ${diffHoras}h`;

  const diffDias = Math.floor(diffHoras / 24);
  return `hace ${diffDias}d`;
}

export default function Notificaciones({
  notificaciones = [],
  onMarcarLeida,
  onMarcarTodasLeidas,
}) {
  const hayNoLeidas = notificaciones.some((n) => !n.leida);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex pt-5 pb-4 px-6 justify-between border-b border-gray-200 items-center ">
        <h2 className="text-lg font-display font-bold ">Notificaciones</h2>
        {hayNoLeidas && (
          <button
            type="button"
            onClick={onMarcarTodasLeidas}
            className="text-brand text-sm cursor-pointer hover:text-[#0b503e]"
          >
            Marcar leídas
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="px-6 py-10 text-sm text-center text-gray-500">
          No tenés notificaciones todavía.
        </div>
      ) : (
        notificaciones.map((notificacion) => (
          <button
            type="button"
            key={notificacion.id}
            onClick={() =>
              !notificacion.leida && onMarcarLeida?.(notificacion.id)
            }
            className={`w-full text-left px-6 py-4 border-b last:border-b-0 flex items-start gap-3 border-gray-200 transition-colors ${
              notificacion.leida
                ? "bg-white"
                : "bg-green-50 hover:bg-green-100 cursor-pointer"
            }`}
          >
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border ${
                notificacion.leida
                  ? "border-gray-300 bg-transparent"
                  : "border-green-600 bg-green-600"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">
                {notificacion.titulo}
              </p>
              <p className="text-sm text-gray-600 leading-6">
                {notificacion.mensaje}
              </p>
            </div>
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {formatearTiempoRelativo(notificacion.created_at)}
            </p>
          </button>
        ))
      )}
    </div>
  );
}
