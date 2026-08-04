export function parseTurnoDateTime(turno) {
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

export function getEstadoBadgeClass(estado) {
  if (estado === "confirmado")
    return "bg-green-100 text-green-700 border-green-300";
  if (estado === "pendiente")
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (estado === "completado")
    return "bg-blue-100 text-blue-700 border-blue-300";
  if (estado === "cancelado") return "bg-red-100 text-red-700 border-red-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
}

export function estaNegocioAbierto(horarios) {
  const ahora = new Date();
  const diaSemanaHoy = ahora.getDay() === 0 ? 7 : ahora.getDay();
  const horarioHoy = horarios?.find((h) => h?.dia === diaSemanaHoy);
  if (!horarioHoy?.activa) return false;

  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const [hDesde, mDesde] = (horarioHoy.desde || "00:00")
    .split(":")
    .map(Number);
  const [hHasta, mHasta] = (horarioHoy.hasta || "00:00")
    .split(":")
    .map(Number);

  return (
    minutosAhora >= hDesde * 60 + mDesde && minutosAhora < hHasta * 60 + mHasta
  );
}

export const MONTHS_SHORT_ES = [
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
