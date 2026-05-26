import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EditarHorarios({ horarios, idNegocio, handleClose }) {
  const [nuevoHorario, setNuevoHorario] = useState(horarios);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (nuevoHorario === horarios) {
      handleClose();
      return;
    }
    console.log("Nuevo horario a guardar:", nuevoHorario);
    setLoading(true);
    const { error } = await supabase
      .from("Negocios")
      .update({ horarios: nuevoHorario })
      .eq("idNegocio", idNegocio);

    if (error) {
      setMensaje("Error al actualizar los horarios.");
    } else {
      setMensaje("Horarios actualizados correctamente.");
      setTimeout(() => handleClose(), 1000);
    }
    setLoading(false);
  }
  return (
    <div className="relative max-w-2xl mx-auto p-6  space-y-6">
      <p className="text-sm text-gray-500">
        Definí el servicio y asignalo a uno o más empleados.
      </p>

      {[...Array(7)].map((_, index) => {
        const horarioDia = nuevoHorario?.find((h) => h?.dia === index + 1);

        return (
          <div
            key={index}
            className={`px-3 py-2 flex items-center gap-4 mb-3 ${!horarioDia?.activa ? "opacity-50" : "bg-brand-light/10 border border-brand/40 rounded-xl"}`}
          >
            <input
              type="checkbox"
              checked={horarioDia?.activa || false}
              onChange={() => {
                setNuevoHorario((prev) =>
                  prev.map((h) =>
                    h.dia === index + 1 ? { ...h, activa: !h.activa } : h,
                  ),
                );
              }}
              id={`dia-${index}`}
              className="w-4 h-4 accent-brand bg-gray-100 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand transition"
            />
            <label htmlFor={`dia-${index}`} className="text-gray-700 text-sm">
              {
                [
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ][index]
              }
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="time"
                value={horarioDia?.desde || "09:00"}
                onChange={(e) => {
                  setNuevoHorario((prev) =>
                    prev.map((h) =>
                      h.dia === index + 1 ? { ...h, desde: e.target.value } : h,
                    ),
                  );
                }}
                className="w-22  py-1 text-sm border bg-background border-brand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">a</span>
              <input
                type="time"
                value={horarioDia?.hasta || "18:00"}
                onChange={(e) => {
                  setNuevoHorario((prev) =>
                    prev.map((h) =>
                      h.dia === index + 1 ? { ...h, hasta: e.target.value } : h,
                    ),
                  );
                }}
                className="w-22  py-1 text-sm  border bg-background border-brand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      })}
      <div className="fixed bottom-0 right-0  w-sm bg-white flex flex-col gap-4 border-t border-gray-300 py-4 px-6 justify-end">
        {mensaje && (
          <p
            className={`text-sm p-2  rounded-xl border ${
              mensaje.includes("Error")
                ? "bg-[#ef44443f] text-red-600 border-red-600"
                : "bg-green-100 text-green-700 border-green-700"
            }`}
          >
            {mensaje}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 cursor-pointer  rounded-full bg-brand text-white font-medium hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Actualizando..." : "Actualizar horarios"}
        </button>
      </div>
    </div>
  );
}
