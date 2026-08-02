"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

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

export default function NotificacionesBell({ session }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    let activo = true;

    const fetchNotificaciones = async () => {
      const { data, error } = await supabase
        .from("Notificaciones")
        .select("*")
        .eq("idUsuario", session.user.id)
        .order("created_at", { ascending: false })
        .limit(15);

      if (error) {
        console.error("Error trayendo notificaciones:", error.message);
      } else if (activo) {
        setNotificaciones(data ?? []);
      }
    };

    fetchNotificaciones();

    return () => {
      activo = false;
    };
  }, [session]);

  useEffect(() => {
    function handleClickFuera(e) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  async function marcarLeida(id) {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n)),
    );

    const { error } = await supabase
      .from("Notificaciones")
      .update({ leida: true })
      .eq("id", id);

    if (error) {
      console.error("Error marcando notificación como leída:", error.message);
    }
  }

  async function marcarTodasLeidas() {
    const idsNoLeidas = notificaciones
      .filter((n) => !n.leida)
      .map((n) => n.id);
    if (idsNoLeidas.length === 0) return;

    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));

    const { error } = await supabase
      .from("Notificaciones")
      .update({ leida: true })
      .in("id", idsNoLeidas);

    if (error) {
      console.error(
        "Error marcando notificaciones como leídas:",
        error.message,
      );
    }
  }

  if (!session) return null;

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="relative" ref={contenedorRef}>
      <button
        onClick={() => setAbierto((prev) => !prev)}
        className="relative inline-flex cursor-pointer items-center justify-center gap-3 h-10 px-2.5 rounded-full text-sm font-medium bg-brand-pale/15 hover:bg-brand-pale/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#FFF"
          viewBox="0 0 256 256"
        >
          <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
        </svg>
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E24B4A] text-white text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden z-40">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-900">Notificaciones</p>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={marcarTodasLeidas}
                className="text-brand text-xs cursor-pointer hover:text-[#0b503e]"
              >
                Marcar leídas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <p className="px-4 py-8 text-sm text-center text-gray-500">
                No tenés notificaciones todavía.
              </p>
            ) : (
              notificaciones.map((notificacion) => (
                <button
                  type="button"
                  key={notificacion.id}
                  onClick={() =>
                    !notificacion.leida && marcarLeida(notificacion.id)
                  }
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 border-gray-100 flex items-start gap-2 transition-colors ${
                    notificacion.leida
                      ? "bg-white"
                      : "bg-green-50 hover:bg-green-100"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notificacion.leida ? "bg-transparent" : "bg-green-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {notificacion.titulo}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {notificacion.mensaje}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap">
                    {formatearTiempoRelativo(notificacion.created_at)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
