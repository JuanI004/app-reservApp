"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CrearServicio() {
  const searchParams = useSearchParams();
  const idNegocio = searchParams.get("idNegocio");

  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idNegocio) return;

    const fetchEmpleados = async () => {
      const { data, error } = await supabase
        .from("negocios_empleados")
        .select(`
          "idEmpleado",
          "Empleados" ( "idEmpleado", "nombre", "apellido" )
        `)
        .eq("idNegocio", idNegocio);

      if (error) {
        console.error(error);
        return;
      }

      const empleadosFormateados = data.map(e => e.Empleados);
      setEmpleados(empleadosFormateados);
    };

    fetchEmpleados();
  }, [idNegocio]);

  const toggleEmpleado = (empleado) => {
    setEmpleadosSeleccionados(prev => {
      const existe = prev.find(e => e.idEmpleado === empleado.idEmpleado);

      if (existe) {
        return prev.filter(e => e.idEmpleado !== empleado.idEmpleado);
      } else {
        return [...prev, empleado];
      }
    });
  };

  const handleSubmit = async () => {
    if (!nombre || !duracion) {
      alert("Faltan datos");
      return;
    }

    setLoading(true);

    // Crear servicio
    const { data: servicio, error: errorServicio } = await supabase
      .from("Servicios")
      .insert({
        nombre,
        descripcion: descripcion,
        precio: parseFloat(precio) || 0,
        duracion: parseInt(duracion),
      })
      .select()
      .single();

    if (errorServicio) {
      console.error(errorServicio);
      setLoading(false);
      return;
    }

    // Insertar relaciones (si hay empleados)
    if (empleadosSeleccionados.length > 0) {
      const relaciones = empleadosSeleccionados.map(e => ({
        idEmpleado: e.idEmpleado,
        idServicio: servicio.idServicio,
      }));

      const { error: errorRel } = await supabase
        .from("empleados_servicios")
        .insert(relaciones);

      if (errorRel) {
        console.error(errorRel);
      }
    }

    setLoading(false);
    alert("Servicio creado");

    // reset
    setNombre("");
    setDuracion("");
    setEmpleadosSeleccionados([]);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Crear Servicio</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border p-2"
        required
      />

      <input
        type="number"
        placeholder="Duración (min)"
        value={duracion}
        onChange={(e) => setDuracion(e.target.value)}
        className="w-full border p-2"
        required
      />
        <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="w-full border p-2"
        required
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border p-2"
      />

      <div>
        <h3 className="font-semibold">Asignar empleados (opcional)</h3>

        {empleados.map(emp => (
          <label key={emp.idEmpleado} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={empleadosSeleccionados.some(
                e => e.idEmpleado === emp.idEmpleado
              )}
              onChange={() => toggleEmpleado(emp)}
            />
            {emp.nombre} {emp.apellido}
          </label>
        ))}
      </div>

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