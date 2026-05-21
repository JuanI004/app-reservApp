// components/negocio/PanelNegocio.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Calendario from "./Calendario";
import CrearServicio from "../../agregarServicios/CrearServicio";
import Button from "../../ui/Button";
import AgregarEmpleados from "../../agregarEmpleados/AgregarEmpleado";

/*const TABS = [
  { id: "calendario", label: "Calendario" },
  { id: "info",       label: "Info"       },
  { id: "empleados",  label: "Empleados"  },
  { id: "servicios",  label: "Servicios"  },
];*/

export default function PanelNegocio({ negocio, turnos }) {
  const router = useRouter();
  const [mostrar, setMostrar] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      {/* Header del panel */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/Home")}
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{negocio?.nombre}</h1>
          <p className="text-sm text-gray-400">{negocio?.direccion}</p>
        </div>
      </div>
      <div className="flex gap-4 ">
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
      )}

      <div className="p-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Calendario</h2>
          <p className="text-gray-400">
            Acá va FullCalendar con los turnos del negocio {negocio?.idNegocio}
          </p>
        </div>
      </div>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Calendario de turnos</h1>
        <Calendario turnos={turnos} />
      </div>
    </div>
  );
}
