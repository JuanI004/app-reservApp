import React from "react";

export default function EstadoTurnos({ turnos = [] }) {
  const confirmados = turnos.filter((t) => t.estado === "confirmado").length;
  const pendientes = turnos.filter((t) => t.estado === "pendiente").length;
  const cancelados = turnos.filter((t) => t.estado === "cancelado").length;
  const completados = turnos.filter((t) => t.estado === "completado").length;

  const total = confirmados + pendientes + cancelados + completados || 1;

  const pConfirm = total > 0 ? (confirmados / total) * 100 : 0;
  const pPend = total > 0 ? (pendientes / total) * 100 : 0;
  const pComp = total > 0 ? (completados / total) * 100 : 0;
  const pCanc = total > 0 ? 100 - pConfirm - pPend - pComp : 0;

  const cols = {
    confirmados: "#0f766e",
    pendientes: "#d97706",
    cancelados: "#e24b4a",
    completados: "#1e40af",
    muted: "#cbd5e1",
  };

  const segments = [];
  let acc = 0;
  const addSeg = (pct, color) => {
    if (pct <= 0) return;
    const start = acc;
    const end = acc + pct;
    segments.push(`${color} ${start}% ${end}%`);
    acc = end;
  };
  addSeg(pConfirm, cols.confirmados);
  addSeg(pPend, cols.pendientes);
  addSeg(pCanc, cols.cancelados);
  addSeg(pComp, cols.completados);
  const donutBackground =
    segments.length > 0
      ? `conic-gradient(${segments.join(", ")})`
      : `conic-gradient(${cols.muted} 0% 100%)`;

  const donutStyle = {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: donutBackground,
    display: "inline-block",
  };

  const legendItem = (label, count, pct, color) => (
    <div className="flex items-center gap-2">
      <span
        style={{
          width: 12,
          height: 12,
          background: count > 0 ? color : cols.muted,
          borderRadius: 4,
        }}
      />
      <span className={count > 0 ? "" : "text-gray-400"}>{label}</span>
      <span className="ml-2 text-xs text-gray-500">{Math.round(pct)}%</span>
    </div>
  );

  return (
    <div className="flex items-center justify-between gap-10">
      <div style={donutStyle} />
      <div className="flex flex-col text-sm">
        {legendItem("Confirmados", confirmados, pConfirm, cols.confirmados)}
        <div className="h-2" />
        {legendItem("Pendientes", pendientes, pPend, cols.pendientes)}
        <div className="h-2" />
        {legendItem("Cancelados", cancelados, pCanc, cols.cancelados)}
        <div className="h-2" />
        {legendItem("Completados", completados, pComp, cols.completados)}
      </div>
    </div>
  );
}
