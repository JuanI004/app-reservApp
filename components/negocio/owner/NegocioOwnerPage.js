// app/negocio/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../lib/supabase";
import AgregarEmpleado from "../../agregarEmpleados/AgregarEmpleado.jsx";
import CrearServicio from "../../agregarServicios/CrearServicio";
import EditarHorarios from "../../editarHorarios/EditarHorarios.jsx";
import TurnosHoy from "./secciones/TurnosDia/TurnosHoy.jsx";
import CalendarioSem from "./secciones/Calendario/CalendarioSem.jsx";
import Estadisticas from "./secciones/estadisticas/Estadisticas.jsx";

export default function NegocioOwnerPage({ negocio, session }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("turnos");
  const [personalTurnos, setPersonalTurnos] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState({ activo: false, modo: null });

  const [error, setError] = useState(null);
  const [turnos, setTurnos] = useState([]);

  const SECCIONES = [
    { label: "Turnos del día", value: "turnos" },
    { label: "Calendario semanal", value: "calendario" },
    { label: "Estadísticas", value: "estadisticas" },
  ];

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
    fetchTurnos();
    setLoading(false);
  }, [negocio, negocio?.idDueño]);

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
                <>
                  <p className="text-sm pt-6 px-6 mb-4  text-gray-500">
                    Buscá un usuario por email y asignale un rol y servicios
                    dentro del negocio.
                  </p>
                  <AgregarEmpleado
                    idNegocio={negocio.idNegocio}
                    handleClose={() =>
                      setModalIsOpen({ activo: false, modo: null })
                    }
                  />
                </>
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
      <div className="min-h-screen bg-background px-5 my-15 w-screen max-w-300 mx-auto">
        <div className="bg-white rounded-xl mt-10 px-6 py-8 flex items-center justify-between ">
          <div className="flex items-center gap-8">
            {negocio?.image_url ? (
              <Image
                src={negocio?.image_url}
                alt={negocio?.nombre}
                className="w-24 h-24 rounded-xl border-6 border-white shadow-md object-cover"
                width={96}
                height={96}
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                {negocio?.nombre ? negocio.nombre.charAt(0) : "N"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-display font-extrabold text-black">
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
          <button
            onClick={() => router.push(`/negocio/${negocio.idNegocio}/editar`)}
            className="bg-brand text-white hover:bg-brand-dark py-2 px-4 leading-5 cursor-pointer flex items-center gap-2 hover:bg-brand-light rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#FFF"
              viewBox="0 0 256 256"
            >
              <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path>
            </svg>
            Editar negocio
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white p-2 mt-5">
          {SECCIONES.map((seccion) => (
            <button
              key={seccion.value}
              onClick={() => setSeccionSeleccionada(seccion.value)}
              className={` rounded-lg cursor-pointer  py-2 px-4 text-sm font-mediumtransition-colors ${seccion.value === seccionSeleccionada ? "bg-brand text-white" : "bg-white text-gray-500  hover:bg-gray-100 "}`}
            >
              {seccion.label}
            </button>
          ))}
        </div>
        {seccionSeleccionada === "turnos" && (
          <TurnosHoy
            negocio={negocio}
            turnos={turnos}
            onAgregarEquipo={onAgregarEquipo}
            onAgregarServicio={onAgregarServicio}
            onEditarHorarios={onEditarHorarios}
            personalTurnos={personalTurnos}
          />
        )}
        {seccionSeleccionada === "calendario" && (
          <CalendarioSem turnos={turnos} negocio={negocio} />
        )}
        {seccionSeleccionada === "estadisticas" && (
          <Estadisticas
            turnos={turnos}
            negocio={negocio}
            personalTurnos={personalTurnos}
          />
        )}
      </div>
    </>
  );
}
