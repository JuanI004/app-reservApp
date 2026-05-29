import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";
import Image from "next/image";

export default function ListaTurnos({
  turnosDeHoy = [],
  personalTurnos = {},
  handleConfirmar,
  handleCancelar,
}) {
  const [filtro, setFiltro] = useState("Todos");
  const [nombresUsuarios, setNombresUsuarios] = useState({});

  useEffect(() => {
    const idsUsuarios = [
      ...new Set(turnosDeHoy.map((turno) => turno.idUsuario).filter(Boolean)),
    ];

    if (idsUsuarios.length === 0) return;

    const fetchNombresUsuarios = async () => {
      const { data, error } = await supabase
        .from("Clientes")
        .select("idCliente, nombre, apellido")
        .in("idCliente", idsUsuarios);

      if (error) {
        console.error("Error trayendo nombre de cliente:", error.message);
        return;
      }

      const nombresMapeados = (data ?? []).reduce((acc, cliente) => {
        acc[cliente.idCliente] =
          `${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim() ||
          "Desconocido";
        return acc;
      }, {});

      setNombresUsuarios((prev) => ({ ...prev, ...nombresMapeados }));
    };
    fetchNombresUsuarios();
  }, [turnosDeHoy]);
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

  const ESTADOS = [
    { label: "Todos", cant: turnosDeHoy.length },
    {
      label: "Pendientes",
      value: "pendiente",
      cant: turnosDeHoy?.filter((t) => t.estado === "pendiente").length,
    },
    {
      label: "Cancelados",
      value: "cancelado",
      cant: turnosDeHoy?.filter((t) => t.estado === "cancelado").length,
    },
    {
      label: "Confirmados",
      value: "confirmado",
      cant: turnosDeHoy?.filter((t) => t.estado === "confirmado").length,
    },
  ];

  const obtenerNombreUsuario = (turno) => {
    return nombresUsuarios[turno.idUsuario] || "Desconocido";
  };

  const turnosFiltrados =
    filtro === "Todos"
      ? turnosDeHoy
      : turnosDeHoy.filter((t) => t.estado + "s" === filtro.toLowerCase());

  return (
    <div className="bg-white w-full rounded-xl pt-5 self-start">
      <h2 className="text-lg font-display px-6 font-bold mb-4">
        Turnos — {formatearFecha(fechaHoy)}
      </h2>
      <div className="w-full border-y border-y-gray-200 bg-background px-6 flex items-center justify-center gap-4 py-3  overflow-x-auto">
        {ESTADOS.map((estado) => (
          <button
            key={estado.label}
            className={`flex gap-2 font-semibold cursor-pointer text-xs transition-all items-center px-3 py-1 rounded-full ${
              filtro === estado.label
                ? "bg-white  text-brand shadow"
                : " text-gray-700"
            }`}
            onClick={() => setFiltro(estado.label)}
          >
            {estado.label}{" "}
            {estado.cant > 0 && (
              <span className="bg-accent flex items-center  text-white px-2 rounded-full text-xs font-medium">
                {estado.cant}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="">
        {turnosFiltrados.length > 0 ? (
          turnosFiltrados.map((turno) => (
            <div
              key={turno.idTurno}
              className="border-t border-gray-200 p-6  flex items-center justify-between"
            >
              <div className="flex items-center  gap-3">
                <div className="border-r border-gray-300 flex flex-col items-center pr-3">
                  <p className="font-display font-bold">
                    {turno.horaInicio.split(":")[0]}:
                    {turno.horaInicio.split(":")[1]}
                  </p>
                  <p className="text-xs text-gray-500">{turno.duracion} min</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {obtenerNombreUsuario(turno)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {turno.servicio || "Servicio Desconocido"}
                  </p>
                  <div>
                    <div className="flex items-center gap-2 mt-1">
                      {personalTurnos[turno.idEmpleado]?.image_url ? (
                        <Image
                          src={personalTurnos[turno.idEmpleado]?.image_url}
                          alt="Avatar Empleado"
                          width={24}
                          height={24}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                          {personalTurnos[turno.idEmpleado]?.nombre
                            ? personalTurnos[turno.idEmpleado].nombre
                                .charAt(0)
                                .toUpperCase()
                            : "?"}
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {personalTurnos[turno.idEmpleado]?.nombre ||
                          "Empleado Desconocido"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p
                  className={`px-3 py-1 rounded-full capitalize  text-xs font-medium ${
                    turno.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : turno.estado === "confirmado"
                        ? "bg-green-100 text-green-800"
                        : turno.estado === "cancelado"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {turno.estado}
                </p>
                {turno.estado === "pendiente" && (
                  <button
                    onClick={() => handleConfirmar(turno.idTurno)}
                    className="p-2 cursor-pointer border border-gray-300 rounded-full hover:bg-brand/10 hover:border-brand hover:text-brand transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </button>
                )}
                {turno.estado !== "cancelado" && (
                  <button
                    onClick={() => handleCancelar(turno.idTurno)}
                    className="p-2 cursor-pointer border border-gray-300 rounded-full hover:bg-red-100 hover:border-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            No hay turnos hoy para mostrar.
          </div>
        )}
      </div>
    </div>
  );
}
