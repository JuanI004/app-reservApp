import { useState } from "react";
import Input from "../ui/Input";
import ServiciosEditor from "../ui/ServiciosEditor";

export default function Pag3({ nextPage, info, setInfo, prevPage }) {
  const [mensaje, setMensaje] = useState("");
  function validarServicios() {
    const newErrores = {};
    if (!info.negocio.servicios || info.negocio.servicios.length === 0) {
      newErrores.servicios = "Agrega al menos un servicio para continuar.";
    }
    for (const servicio of info.negocio.servicios) {
      if (!servicio.nombre || !servicio.duracion || !servicio.precio) {
        newErrores.servicios =
          "Completa todos los campos de los servicios para continuar.";
      }
      if (isNaN(servicio.duracion) || isNaN(servicio.precio)) {
        newErrores.servicios =
          "La duración y el precio deben ser números válidos.";
      }
      if (servicio.duracion <= 0 || servicio.precio < 0) {
        newErrores.servicios =
          "La duración debe ser mayor a 0 y el precio no puede ser negativo.";
      }
    }
    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validarServicios()) {
      nextPage();
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6  z-10">
      <form className="w-full">
        <h2 className="text-xl text-gray-600 font-display font-bold ">
          Servicios que ofrecés
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Agregá los servicios con su duración y precio. Podés editarlos
          después.
        </p>
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <div className="w-full flex flex-col gap-4">
            <ServiciosEditor
              servicios={info.negocio?.servicios ?? []}
              onChange={(nuevos) =>
                setInfo((prev) => ({
                  ...prev,
                  negocio: { ...prev.negocio, servicios: nuevos },
                }))
              }
            />
          </div>
          {mensaje.servicios && (
            <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
              {mensaje.servicios}
            </p>
          )}
        </div>
      </form>
      <div className="mt-auto flex justify-between">
        <button
          onClick={prevPage}
          className="px-6 py-2 border border-brand text-brand cursor-pointer rounded-full hover:bg-gray-200 transition"
        >
          {"< Anterior"}
        </button>
        <button
          onClick={nextPage}
          className="px-6 py-2 bg-brand cursor-pointer text-white rounded-full hover:bg-brand/90 transition"
        >
          {"Siguiente >"}
        </button>
      </div>
    </div>
  );
}
