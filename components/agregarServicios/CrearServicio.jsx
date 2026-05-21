"use client";

import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

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
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Crear Servicio</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          setMensaje((prev) => prev.filter((m) => m.tipo !== "nombreError"));
        }}
        className="w-full border p-2"
        required
      />
      {mensaje.some((m) => m.tipo === "nombreError") && (
        <p className="text-red-500 text-sm">
          {mensaje.find((m) => m.tipo === "nombreError").msj}
        </p>
      )}

      <input
        type="number"
        placeholder="Duración (min)"
        min="0"
        value={duracion}
        onChange={(e) => {
          setMensaje((prev) => prev.filter((m) => m.tipo !== "duracionError"));
          setDuracion(e.target.value);
        }}
        className="w-full border p-2"
        required
      />
      {mensaje.some((m) => m.tipo === "duracionError") && (
        <p className="text-red-500 text-sm">
          {mensaje.find((m) => m.tipo === "duracionError").msj}
        </p>
      )}
      <input
        type="number"
        min="0"
        placeholder="Precio"
        value={precio}
        onChange={(e) => {
          setMensaje((prev) => prev.filter((m) => m.tipo !== "precioError"));
          setPrecio(e.target.value);
        }}
        className="w-full border p-2"
        required
      />
      {mensaje.some((m) => m.tipo === "precioError") && (
        <p className="text-red-500 text-sm">
          {mensaje.find((m) => m.tipo === "precioError").msj}
        </p>
      )}

      <div>
        <h3 className="font-semibold">Asignar empleados (opcional)</h3>

        {empleados.map((emp) => (
          <label key={emp.idEmpleado} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={empleadosSeleccionados.some(
                (e) => e.idEmpleado === emp.idEmpleado,
              )}
              onChange={() => toggleEmpleado(emp)}
            />
            {emp.nombre} {emp.apellido}
          </label>
        ))}
      </div>

      {mensaje.some((m) => m.tipo === "generalError") && (
        <p className="text-red-500 text-sm">
          {mensaje.find((m) => m.tipo === "generalError").msj}
        </p>
      )}

      {mensaje.some((m) => m.tipo === "generalSuccess") && (
        <p className="text-green-500 text-sm">
          {mensaje.find((m) => m.tipo === "generalSuccess").msj}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Creando..." : "Crear servicio"}
      </button>
    </div>
  );
}
