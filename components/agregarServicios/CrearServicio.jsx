"use client";

import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import Input from "../ui/Input";
import Label from "../ui/Label";

export default function CrearServicio({ idNegocio }) {
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [precio, setPrecio] = useState("");
  const [mensaje, setMensaje] = useState([]);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idNegocio) return;

    const fetchEmpleados = async () => {
      const { data, error } = await supabase
        .from("Empleados")
        .select("*")
        .eq("idNegocio", idNegocio);

      if (error) {
        console.error(error);
        return;
      }

      setEmpleados(data);
    };

    fetchEmpleados();
  }, [idNegocio]);

  const toggleEmpleado = (empleado) => {
    setEmpleadosSeleccionados((prev) => {
      const existe = prev.find((e) => e.idEmpleado === empleado.idEmpleado);

      if (existe) {
        return prev.filter((e) => e.idEmpleado !== empleado.idEmpleado);
      } else {
        return [...prev, empleado];
      }
    });
  };

  function validarCampos() {
    let errores = [];

    if (!nombre.trim()) {
      errores.push({
        tipo: "nombreError",
        msj: "El nombre del servicio es obligatorio.",
      });
    }

    if (!duracion || isNaN(duracion) || duracion <= 0) {
      errores.push({
        tipo: "duracionError",
        msj: "La duración debe ser un número positivo.",
      });
    }

    if (!precio || isNaN(precio) || precio < 0) {
      errores.push({
        tipo: "precioError",
        msj: "El precio debe ser un número no negativo.",
      });
    }

    setMensaje(errores);
    return errores.length === 0;
  }

  function construirServicio() {
    return {
      nombre,
      duracion: String(duracion),
      precio: String(precio),
    };
  }

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    const nuevoServicio = construirServicio();

    const { data: negocioActual, error: errorNegocioActual } = await supabase
      .from("Negocios")
      .select("servicios")
      .eq("idNegocio", idNegocio)
      .single();

    if (errorNegocioActual) {
      setMensaje([
        { tipo: "generalError", msj: "Error al cargar el negocio." },
      ]);
      setLoading(false);
      return;
    }

    // Crear servicio
    const { data: servicio, error: errorServicio } = await supabase
      .from("Negocios")
      .update({
        servicios: [...(negocioActual?.servicios ?? []), nuevoServicio],
      })
      .eq("idNegocio", idNegocio)
      .select()
      .single();

    if (errorServicio) {
      setMensaje([
        { tipo: "generalError", msj: "Error al crear el servicio." },
      ]);
      setLoading(false);
      return;
    }

    for (const emp of empleadosSeleccionados) {
      const serviciosEmpleado = Array.isArray(emp.servicios)
        ? emp.servicios
        : [];

      const { error: errorRel } = await supabase
        .from("Empleados")
        .update({
          servicios: [...serviciosEmpleado, nuevoServicio],
        })
        .eq("idEmpleado", emp.idEmpleado);

      if (errorRel) {
        setMensaje((prev) => [
          ...prev,
          {
            tipo: "generalError",
            msj: `Error al asignar el servicio a ${emp.nombre} ${emp.apellido}.`,
          },
        ]);
      }
    }

    setLoading(false);
    setMensaje([
      { tipo: "generalSuccess", msj: "Servicio creado exitosamente." },
    ]);

    // reset
    setNombre("");
    setDuracion("");
    setPrecio("");
    setEmpleadosSeleccionados([]);
  };

  return (
    <div className="absolute max-w-2xl mx-auto rounded-2xl p-6 space-y-6">
      <p className="text-sm text-gray-500">
        Definí el servicio y asignalo a uno o más empleados.
      </p>

      <div className="space-y-2">
        <Label htmlFor="nombreServicio">Nombre del servicio</Label>
        <Input
          id="nombreServicio"
          type="text"
          placeholder="Corte, Color, Barba..."
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setMensaje((prev) => prev.filter((m) => m.tipo !== "nombreError"));
          }}
          required
        />
      </div>
      {mensaje.some((m) => m.tipo === "nombreError") && (
        <p className="text-sm p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
          {mensaje.find((m) => m.tipo === "nombreError").msj}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="duracionServicio">Duración en minutos</Label>
        <Input
          id="duracionServicio"
          type="number"
          placeholder="60"
          min="0"
          value={duracion}
          onChange={(e) => {
            setMensaje((prev) =>
              prev.filter((m) => m.tipo !== "duracionError"),
            );
            setDuracion(e.target.value);
          }}
          required
        />
      </div>
      {mensaje.some((m) => m.tipo === "duracionError") && (
        <p className="text-sm p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
          {mensaje.find((m) => m.tipo === "duracionError").msj}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="precioServicio">Precio</Label>
        <Input
          id="precioServicio"
          type="number"
          min="0"
          placeholder="0"
          value={precio}
          onChange={(e) => {
            setMensaje((prev) => prev.filter((m) => m.tipo !== "precioError"));
            setPrecio(e.target.value);
          }}
          required
        />
      </div>
      {mensaje.some((m) => m.tipo === "precioError") && (
        <p className="text-sm p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
          {mensaje.find((m) => m.tipo === "precioError").msj}
        </p>
      )}

      <div className="space-y-3 rounded-xl border border-gray-200 bg-background/60 p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Asignar empleados
          </h3>
          <p className="text-xs text-gray-500">Opcional</p>
        </div>

        <div className="grid gap-2">
          {empleados.map((emp) => (
            <label
              key={emp.idEmpleado}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={empleadosSeleccionados.some(
                  (e) => e.idEmpleado === emp.idEmpleado,
                )}
                onChange={() => toggleEmpleado(emp)}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span>
                {emp.nombre} {emp.apellido}
              </span>
            </label>
          ))}
        </div>
      </div>

      {mensaje.some((m) => m.tipo === "generalError") && (
        <p className="text-sm p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
          {mensaje.find((m) => m.tipo === "generalError").msj}
        </p>
      )}

      {mensaje.some((m) => m.tipo === "generalSuccess") && (
        <p className="text-sm p-2 rounded-lg border bg-green-100 text-green-700 border-green-700">
          {mensaje.find((m) => m.tipo === "generalSuccess").msj}
        </p>
      )}
      <div className="fixed bottom-0 right-0  w-sm bg-white flex border-t border-gray-300 py-4 px-6 justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-brand text-white font-medium hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creando..." : "Crear servicio"}
        </button>
      </div>
    </div>
  );
}
