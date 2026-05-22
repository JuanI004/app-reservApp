// components/negocio/PanelNegocio.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ListaTurnos from "./ListaTurnos";

export default function PanelNegocio({ negocio, turnos }) {
  const router = useRouter();
  const [mostrar, setMostrar] = useState(null);

  function filtrarTurnosHoy() {
    const hoy = new Date();
    return turnos.filter((turno) => {
      const fechaInicio = new Date(turno.fecha_inicio);
      return (
        fechaInicio.getDate() === hoy.getDate() &&
        fechaInicio.getMonth() === hoy.getMonth() &&
        fechaInicio.getFullYear() === hoy.getFullYear()
      );
    });
  }
  const turnosHoy = filtrarTurnosHoy();
  const turnosPendientes = turnos.filter((t) => t.estado === "pendiente");
  const turnosCancelados = turnos.filter((t) => t.estado === "cancelado");

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
    <div className="min-h-screen bg-background px-5 mt-20 w-screen max-w-[1200px] mx-auto">
      {/* Header del panel */}
      <div className="bg-white rounded-xl mt-10  px-6 py-8  flex items-center  gap-8">
        {negocio?.image_url ? (
          <img
            src={negocio?.image_url}
            alt={negocio?.nombre}
            className="w-24 h-24 rounded-xl border-6 border-white shadow-md object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
            {negocio?.nombre ? negocio.nombre.charAt(0) : "N"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-display font-[800] text-black">
            {negocio?.nombre}
          </h1>
          <p className="text-sm text-gray-400 capitalize">
            {negocio?.categoria} · {negocio?.direccion}
          </p>
          <div className="flex items-center gap-1">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#99a1af"
              viewBox="0 0 256 256"
              className="mt-1"
            >
              <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
            </svg>
            <p className="text-sm text-gray-400 mt-1">
              {negocio?.telefono || "Sin teléfono"}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex gap-4 ">
        <Button
          onClick={(prev) =>
            setMostrar(prev === "crear-servicio" ? null : "crear-servicio")
          }
          className="mt-4 flex ml-6 items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Crear servicio
          <span
            className={`transition-transform duration-300 ${
              mostrar === "crear-servicio" ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </Button>

        <Button
          onClick={(prev) =>
            setMostrar(
              prev === "agregar-empleados" ? null : "agregar-empleados",
            )
          }
          className="mt-4 flex  items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Agregar empleados
          <span
            className={`transition-transform duration-300 ${
              mostrar === "agregar-empleados" ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </Button>
      </div>
      {mostrar === "crear-servicio" && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            mostrar === "crear-servicio"
              ? "max-h-[500px] opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white p-4 rounded shadow">
            <CrearServicio idNegocio={negocio?.idNegocio} />
          </div>
        </div>
      )}
      {mostrar === "agregar-empleados" && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            mostrar === "agregar-empleados"
              ? "max-h-[500px] opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white p-4 rounded shadow">
            <AgregarEmpleados idNegocio={negocio?.idNegocio} />
          </div>
        </div>
      )} */}

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

              <p className="text-2xl font-display font-[800] text-gray-900">
                {tab.value}
              </p>
              {tab.extra && (
                <p className="text-xs text-brand-light mt-1">{tab.extra}</p>
              )}
            </div>
          </div>
        ))}
      </section>
      <main className="grid grid-cols-1 sm:grid-cols-[6fr_4fr] mt-5 gap-5">
        <ListaTurnos turnos={turnos} />
      </main>
    </div>
  );
}
