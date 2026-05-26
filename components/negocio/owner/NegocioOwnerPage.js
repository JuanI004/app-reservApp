// app/negocio/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AgregarEmpleado from "../../agregarEmpleados/AgregarEmpleado.jsx";
import CrearServicio from "../../agregarServicios/CrearServicio";
import EditarHorarios from "../../editarHorarios/EditarHorarios.jsx";
import PanelNegocio from "./PanelNegocio.jsx";

export default function NegocioOwnerPage({ negocio, session }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState({ activo: false, modo: null });

  const [error, setError] = useState(null);
  const [turnos, setTurnos] = useState([]);

  async function fetchTurnos() {
    const { data, error } = await supabase
      .from("Turnos")
      .select("*")
      .eq("idNegocio", negocio?.idNegocio);

    if (error) {
      console.error("Error trayendo turnos:", error.message);
    } else {
      setTurnos(data);
    }
  }

  function onAgregarEquipo() {
    setModalIsOpen({ activo: true, modo: "empleado" });
  }

  function onAgregarServicio() {
    setModalIsOpen({ activo: true, modo: "servicio" });
  }

  function onEditarHorarios() {
    setModalIsOpen({ activo: true, modo: "horarios" });
  }

  useEffect(() => {
    if (!negocio) {
      return;
    }
    fetchTurnos();
    setLoading(false);
  }, [negocio]);

  if (loading) return <div className="p-10 mt-20">Cargando...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <>
      {modalIsOpen.activo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="absolute right-0 bg-white h-screen overflow-scroll w-full max-w-sm">
            <div className="flex justify-between border-b border-gray-300 items-center p-6">
              <h2 className="text-xl font-display font-[700]">
                {modalIsOpen.modo === "empleado" && "Agregar Empleado"}
                {modalIsOpen.modo === "servicio" && "Agregar Servicio"}
                {modalIsOpen.modo === "horarios" && "Editar Horarios"}
              </h2>
              <button
                className="text-gray-700 h-[35px] px-2 cursor-pointer rounded-xl border border-gray-300 hover:bg-gray-200 transition"
                onClick={() => setModalIsOpen({ activo: false, modo: null })}
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
            </div>
            <div>
              {modalIsOpen.modo === "empleado" && (
                <AgregarEmpleado
                  idNegocio={negocio.idNegocio}
                  handleClose={() =>
                    setModalIsOpen({ activo: false, modo: null })
                  }
                />
              )}
              {modalIsOpen.modo === "servicio" && (
                <CrearServicio
                  idNegocio={negocio.idNegocio}
                  handleClose={() =>
                    setModalIsOpen({ activo: false, modo: null })
                  }
                />
              )}
              {modalIsOpen.modo === "horarios" && (
                <EditarHorarios
                  horarios={negocio.horarios}
                  handleClose={() =>
                    setModalIsOpen({ activo: false, modo: null })
                  }
                  idNegocio={negocio.idNegocio}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <PanelNegocio
        negocio={negocio}
        turnos={turnos}
        onAgregarEquipo={onAgregarEquipo}
        onAgregarServicio={onAgregarServicio}
        onEditarHorarios={onEditarHorarios}
      />
      ;
    </>
  );
}
