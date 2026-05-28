// components/negocio/PanelNegocio.jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabase";
import ListaTurnos from "./ListaTurnos";
import Image from "next/image";

export default function PanelNegocio({
  negocio,
  turnos = [],
  onAgregarEquipo,
  onAgregarServicio,
  onEditarHorarios,
}) {
  const [personalTurnos, setPersonalTurnos] = useState({});
  const [servicios, setServicios] = useState();
  const [horarios, setHorarios] = useState();

  useEffect(() => {
    if (!negocio?.idNegocio) return;

    let activo = true;

    const fetchServiciosyHorarios = async () => {
      const { data: servicios, error } = await supabase
        .from("Negocios")
        .select("servicios, horarios")
        .eq("idNegocio", negocio.idNegocio);

      if (error) {
        console.error("Error trayendo servicios:", error.message);
      }
      if (servicios && servicios.length > 0) {
        setServicios(servicios[0].servicios);
        setHorarios(servicios[0].horarios);
        console.log("Servicios obtenidos:", servicios);
      }
    };

    const fetchPersonalTurnos = async () => {
      const { data: empleados, error: errorEmpleados } = await supabase
        .from("Empleados")
        .select("idEmpleado, nombre, image_url, rol")
        .eq("idNegocio", negocio.idNegocio);

      const { data: duenio, error: errorDuenio } = negocio?.idDueño
        ? await supabase
            .from("Duenos")
            .select("idDueño, nombre, apellido, image_url")
            .eq("idDueño", negocio.idDueño)
            .single()
        : { data: null, error: null };

      if (!activo) return;

      if (errorEmpleados) {
        console.error("Error trayendo empleados:", errorEmpleados.message);
      }

      if (errorDuenio) {
        console.error("Error trayendo dueño:", errorDuenio.message);
      }

      const personalMapeado = (empleados ?? []).reduce((acc, empleado) => {
        acc[empleado.idEmpleado] = {
          nombre: empleado.nombre || "Desconocido",
          image_url: empleado.image_url,
          rol: empleado.rol || "Desconocido",
        };
        return acc;
      }, {});

      if (duenio) {
        personalMapeado[duenio.idDueño] = {
          nombre:
            `${duenio.nombre ?? ""} ${duenio.apellido ?? ""}`.trim() ||
            "Desconocido",
          image_url: duenio.image_url,
          rol: "Dueño",
        };
      }

      setPersonalTurnos(personalMapeado);
    };

    fetchPersonalTurnos();
    fetchServiciosyHorarios();

    return () => {
      activo = false;
    };
  }, [negocio?.idNegocio, negocio?.idDueño]);

  function getTurnosCantEmpleadoHoy(idEmpleado) {
    const hoy = new Date();
    const turnosHoy = turnos.filter((turno) => {
      return (
        turno.idEmpleado === idEmpleado &&
        new Date(turno.fecha_inicio).getDate() === hoy.getDate() &&
        new Date(turno.fecha_inicio).getMonth() === hoy.getMonth() &&
        new Date(turno.fecha_inicio).getFullYear() === hoy.getFullYear()
      );
    });
    return turnosHoy.length;
  }

  const fechaHoy = new Date();
  function formatDateToYYYYMMDD(input) {
    if (!input) return "";
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    const d = new Date(input);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const fechaHoyStr = formatDateToYYYYMMDD(fechaHoy);
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

  const turnosHoy = turnos.filter(
    (t) => formatDateToYYYYMMDD(t.fecha) === fechaHoyStr,
  );
  const turnosPendientes = turnosHoy.filter((t) => t.estado === "pendiente");
  const turnosCancelados = turnosHoy.filter((t) => t.estado === "cancelado");

  const TABS = [
    {
      label: "Turnos hoy",
      value: turnosHoy.length,
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
      extra: `${turnosPendientes.length} pendientes · ${turnosCancelados.length} cancelados`,
      color: "#1d9e75",
    },
    {
      label: "Este mes",
      value: turnos.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#2563EB"
          viewBox="0 0 256 256"
        >
          <path d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z"></path>
        </svg>
      ),
      extra: "↑ 12% vs mes anterior",
      color: "#2563EB",
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
      label: "Cancelados",
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
  ];

  return (
    <>
      {/* Header del panel */}

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
      <main className="flex flex-col md:flex-row mt-5 gap-5">
        <ListaTurnos turnosDeHoy={turnosHoy} personalTurnos={personalTurnos} />
        <section className="md:w-2/3 flex flex-col gap-5">
          <div className="bg-white rounded-xl ">
            <div className="flex pt-5 pb-4 px-6 justify-between border-b border-gray-200 items-center ">
              <h2 className="text-lg font-display font-bold ">Equipo</h2>
              <p
                className="text-brand text-sm cursor-pointer hover:text-[#0b503e]"
                onClick={onAgregarEquipo}
              >
                + Agregar
              </p>
            </div>
            <div className="w-full">
              {Object.values(personalTurnos).length === 0 ? (
                <p className="text-sm text-gray-500">
                  No hay personal registrado
                </p>
              ) : (
                Object.values(personalTurnos).map((persona) => (
                  <div
                    key={persona.nombre}
                    className="flex items-center  px-6 justify-between  py-4 border-t border-gray-200 last:mb-0"
                  >
                    <div className="flex gap-3 ">
                      {persona.image_url ? (
                        <Image
                          src={persona.image_url}
                          alt={persona.nombre}
                          width={100}
                          height={100}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                          {persona.nombre.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">{persona.nombre}</p>
                        <p className="text-xs text-gray-500">{persona.rol}</p>
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <h2 className="font-display text-right font-[700] leading-4">
                        {getTurnosCantEmpleadoHoy(persona.id)}
                      </h2>
                      <p className="text-xs text-gray-500">hoy</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl ">
            <div className="flex pt-5 pb-4 px-6 justify-between border-b border-gray-200 items-center ">
              <h2 className="text-lg font-display font-bold ">Servicios</h2>
              <p
                className="text-brand text-sm cursor-pointer hover:text-[#0b503e]"
                onClick={onAgregarServicio}
              >
                + Crear
              </p>
            </div>
            <div className="w-full">
              {servicios?.length === 0 ? (
                <p className="py-4 px-6 text-sm text-gray-500">
                  No hay servicios registrados
                </p>
              ) : (
                servicios?.map((servicio) => (
                  <div
                    key={servicio?.idServicio}
                    className="flex items-center  px-6 justify-between  py-4 border-t border-gray-200 last:mb-0"
                  >
                    <div className="flex gap-3 ">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">{servicio?.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {servicio?.duracion} min
                        </p>
                      </div>
                    </div>

                    <h2 className="text-brand text-right text-sm font-bold leading-4">
                      ${servicio?.precio}
                    </h2>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl ">
            <div className="flex pt-5 pb-4 px-6 justify-between border-b border-gray-200 items-center ">
              <h2 className="text-lg font-display font-bold ">Horarios</h2>
              <p
                className="text-brand text-sm cursor-pointer hover:text-[#0b503e]"
                onClick={onEditarHorarios}
              >
                Editar
              </p>
            </div>
            <div className="w-full">
              {horarios?.length === 0 ? (
                <p className="py-4 px-6 text-sm text-gray-500">
                  No hay horarios registrados
                </p>
              ) : (
                horarios?.map((horario, index) => (
                  <div
                    key={index}
                    className="flex items-center  px-6 justify-between  py-4 border-t border-gray-200 last:mb-0"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${horario?.activa ? "bg-brand-light" : "bg-gray-300"}`}
                    />
                    <p className="text-sm font-bold">
                      {
                        [
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                          "Domingo",
                        ][horario?.dia - 1]
                      }
                    </p>
                    {horario?.activa ? (
                      <p className="text-sm text-gray-500">
                        {horario?.desde} - {horario?.hasta}
                      </p>
                    ) : (
                      <p className="text-sm italic text-gray-500">Cerrado</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
