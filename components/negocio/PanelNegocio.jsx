// components/negocio/PanelNegocio.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Calendario from "./Calendario";

/*const TABS = [
  { id: "calendario", label: "Calendario" },
  { id: "info",       label: "Info"       },
  { id: "empleados",  label: "Empleados"  },
  { id: "servicios",  label: "Servicios"  },
];*/

export default function PanelNegocio({ negocio, turnos }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      {/* Header del panel */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/home")}
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{negocio.nombre}</h1>
          <p className="text-sm text-gray-400">{negocio.direccion}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Calendario</h2>
          <p className="text-gray-400">
            Acá va FullCalendar con los turnos del negocio {negocio.idNegocio}
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
