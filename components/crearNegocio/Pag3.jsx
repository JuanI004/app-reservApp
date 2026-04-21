import { useState } from "react";

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
            {info.negocio?.servicios?.map((servicio, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={servicio.nombre}
                  onChange={(e) => {
                    const nuevosServicios = [...(info.negocio.servicios || [])];
                    nuevosServicios[index] = {
                      ...nuevosServicios[index],
                      nombre: e.target.value,
                    };
                    setInfo((prev) => ({
                      ...prev,
                      negocio: {
                        ...prev.negocio,
                        servicios: nuevosServicios,
                      },
                    }));
                  }}
                  className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Duración (min)"
                  value={servicio.duracion}
                  onChange={(e) => {
                    const nuevosServicios = [...(info.negocio.servicios || [])];
                    nuevosServicios[index] = {
                      ...nuevosServicios[index],
                      duracion: e.target.value,
                    };
                    setInfo((prev) => ({
                      ...prev,
                      negocio: {
                        ...prev.negocio,
                        servicios: nuevosServicios,
                      },
                    }));
                  }}
                  className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Precio"
                  value={servicio.precio}
                  onChange={(e) => {
                    const nuevosServicios = [...(info.negocio.servicios || [])];
                    nuevosServicios[index] = {
                      ...nuevosServicios[index],
                      precio: e.target.value,
                    };
                    setInfo((prev) => ({
                      ...prev,
                      negocio: {
                        ...prev.negocio,
                        servicios: nuevosServicios,
                      },
                    }));
                  }}
                  className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nuevosServicios = [...(info.negocio.servicios || [])];
                    nuevosServicios.splice(index, 1);
                    setInfo((prev) => ({
                      ...prev,
                      negocio: {
                        ...prev.negocio,
                        servicios: nuevosServicios,
                      },
                    }));
                  }}
                  className="p-2 bg-white text-[#E24B4A] border cursor-pointer border-gray-300 rounded hover:border hover:bg-[#E24B4A]/10 hover:border-[#E24B4A] transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#E24B4A"
                    viewBox="0 0 256 256"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {mensaje.servicios && (
            <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
              {mensaje.servicios}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              const nuevosServicios = [
                ...(info.negocio.servicios || []),
                { nombre: "", duracion: "", precio: "" },
              ];
              setInfo((prev) => ({
                ...prev,
                negocio: {
                  ...prev.negocio,
                  servicios: nuevosServicios,
                },
              }));
            }}
            className="px-6  cursor-pointer bg-brand text-white py-2 rounded-full hover:bg-brand/90 transition"
          >
            Agregar servicio
          </button>
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
