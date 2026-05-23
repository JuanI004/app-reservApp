import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";

export default function ListaTurnos({ turnos }) {
  const [filtro, setFiltro] = useState("Todos");
  const [nombresUsuarios, setNombresUsuarios] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
  useEffect(() => {
    const idsUsuarios = [
      ...new Set(turnos.map((turno) => turno.idUsuario).filter(Boolean)),
    ];
    const idEmpleados = [
      ...new Set(turnos.map((turno) => turno.idEmpleado).filter(Boolean)),
    ];

    if (idsUsuarios.length === 0 && idEmpleados.length === 0) return;

    const fetchNombresEmpleados = async () => {
      const { data, error } = await supabase
        .from("Empleados")
        .select("idEmpleado, nombre,  image_url")
        .in("idEmpleado", idEmpleados);

      if (error) {
        console.error("Error trayendo nombre de empleado:", error.message);
        return;
      }

      const nombresMapeados = (data ?? []).reduce((acc, empleado) => {
        acc[empleado.idEmpleado] = {
          nombre: `${empleado.nombre ?? ""}`.trim() || "Desconocido",
          image_url: empleado.image_url,
        };
        return acc;
      }, {});

      setNombresUsuarios((prev) => ({ ...prev, ...nombresMapeados }));
    };

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

      setNombresUsuarios(nombresMapeados);
    };
    fetchNombresEmpleados();
    fetchNombresUsuarios();
    setIsLoading(false);
  }, [turnos]);

  const obtenerNombreUsuario = (turno) => {
    return nombresUsuarios[turno.idUsuario] || "Desconocido";
  };
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
        {turnos
          .filter(
            (t) => filtro === "Todos" || t.estado === filtro.toLowerCase(),
          )
          .map((turno) => (
            <div
              key={turno.idTurno}
              className="border-b border-gray-200 p-6  flex items-center justify-between"
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
                  <p className="font-semibold">{obtenerNombreUsuario(turno)}</p>
                  <p className="text-sm text-gray-500">
                    {turno.servicio || "Servicio Desconocido"}
                  </p>
                  <div>
                    {turno.idEmpleado && (
                      <div className="flex items-center gap-2 mt-1">
                        <Image
                          src={
                            nombresUsuarios[turno.idEmpleado]?.image_url ||
                            "/default-avatar.png"
                          }
                          alt="Avatar Empleado"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-500">
                          {nombresUsuarios[turno.idEmpleado]?.nombre ||
                            "Empleado Desconocido"}
                        </span>
                      </div>
                    )}
                    <p>{nombresUsuarios[turno.idEmpleado]?.nombre}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
