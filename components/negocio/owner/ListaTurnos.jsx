import { useState } from "react";

export default function ListaTurnos({ turnos }) {
  const [filtro, setFiltro] = useState("Todos");
  const ESTADOS = [
    { label: "Todos", cant: turnos.length },
    {
      label: "Pendientes",
      value: "pendiente",
      cant: turnos?.filter((t) => t.estado === "pendiente").length,
    },
    {
      label: "Cancelados",
      value: "cancelado",
      cant: turnos?.filter((t) => t.estado === "cancelado").length,
    },
    {
      label: "Confirmados",
      value: "confirmado",
      cant: turnos?.filter((t) => t.estado === "confirmado").length,
    },
  ];
  const fechaHoy = new Date();
  function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    const partes = date.toLocaleDateString("es-AR", opciones).split(" ");
    return `${partes[0]} ${partes[1]} de ${partes[3]}`;
  }
  return (
    <div className="bg-white  rounded-lg  py-5">
      <h2 className="text-lg font-display px-6 font-[700] mb-4">
        Turnos — {formatearFecha(fechaHoy)}
      </h2>
      <div className="w-full border-y border-y-gray-200 bg-background px-6 flex items-center justify-center gap-4 py-3  overflow-x-auto">
        {ESTADOS.map((estado) => (
          <button
            key={estado.label}
            className={`flex gap-2 font-semibold cursor-pointer text-xs transition-all items-center px-2 py-1 rounded-full ${
              filtro === estado.value
                ? "bg-white  text-brand shadow"
                : " text-gray-700"
            }`}
            onClick={() => setFiltro(estado.value)}
          >
            {estado.label}{" "}
            {estado.cant > 0 && (
              <span className="bg-[#d85a30] flex items-center  text-white px-1 rounded-full text-xs font-medium">
                {estado.cant}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
