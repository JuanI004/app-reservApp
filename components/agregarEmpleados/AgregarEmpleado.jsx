"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Image from "next/image";
import Input from "../ui/Input";
import Label from "../ui/Label";

export default function AgregarEmpleado({ idNegocio, handleClose }) {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      const { data, error } = await supabase
        .from("Negocios")
        .select("servicios")
        .eq("idNegocio", idNegocio)
        .single();
      if (!error) {
        setServicios(data.servicios || []);
      }
    };

    fetchServicios();
  }, [idNegocio]);

  const buscarUsuario = async () => {
    if (!email.trim()) return;

    setBuscando(true);
    setUsuarioEncontrado(null);
    setMensaje(null);

    const { data, error } = await supabase
      .from("Clientes")
      .select("idCliente, email, nombre, apellido, image_url")
      .eq("email", email)
      .single();

    if (error || !data) {
      setMensaje({
        tipo: "error",
        texto: "No se encontró ningún usuario con ese email.",
      });
    } else {
      setUsuarioEncontrado(data);
    }

    setBuscando(false);
  };

  const handleSubmit = async () => {
    if (!usuarioEncontrado) {
      setMensaje({ tipo: "error", texto: "Primero buscá el usuario." });
      return;
    }
    if (!idNegocio) {
      setMensaje({ tipo: "error", texto: "No se encontró el negocio." });
      return;
    }

    setLoading(true);
    setMensaje(null);

    const { error } = await supabase.from("Empleados").insert({
      idNegocio: parseInt(idNegocio),
      idEmpleado: usuarioEncontrado.idCliente,
      image_url: usuarioEncontrado.image_url || null,
      servicios: serviciosSeleccionados,
      nombre: usuarioEncontrado.nombre
        ? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido ?? ""}`.trim()
        : email,
      rol: rol || null,
      activo: true,
    });

    if (error) {
      if (error.code === "23505") {
        setMensaje({
          tipo: "error",
          texto: "Este usuario ya es empleado de este negocio.",
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: `Error: ${error.message}`,
        });
      }
    } else {
      setMensaje({
        tipo: "success",
        texto: `${usuarioEncontrado.nombre ?? email} fue agregado como empleado.`,
      });
      setEmail("");
      setRol("");
      setServiciosSeleccionados([]);
      setUsuarioEncontrado(null);
      handleClose();
    }

    setLoading(false);
  };

  const toggleServicio = (servicio) => {
    setServiciosSeleccionados((prev) => {
      const existe = prev.find((s) => s.nombre === servicio.nombre);

      if (existe) {
        return prev.filter((s) => s.nombre !== servicio.nombre);
      } else {
        return [...prev, servicio];
      }
    });
  };

  return (
    <div className="relative max-w-2xl mx-auto  space-y-6">
      <p className="text-sm pt-6 px-6 text-gray-500">
        Buscá un usuario por email y asignale un rol y servicios dentro del
        negocio.
      </p>

      <div className="space-y-2 px-6">
        <Label htmlFor="emailEmpleado">Email del empleado</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="emailEmpleado"
            type="email"
            placeholder="empleado@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setUsuarioEncontrado(null);
              setMensaje(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && buscarUsuario()}
            className="flex-1"
          />
          <button
            onClick={buscarUsuario}
            disabled={buscando || !email.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-background border border-gray-300  hover:bg-brand/20 hover:border-brand hover:text-brand disabled:cursor-not-allowed transition"
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>
      {usuarioEncontrado && (
        <div className="flex items-center gap-3 px-6 py-4 border border-gray-200 rounded-xl bg-background/60">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
            {usuarioEncontrado.image_url ? (
              <Image
                width={36}
                height={36}
                src={usuarioEncontrado.image_url}
                alt={usuarioEncontrado.email}
                className="w-full h-full object-cover rounded-full"
              />
            ) : usuarioEncontrado.nombre ? (
              usuarioEncontrado.nombre.charAt(0).toUpperCase()
            ) : (
              usuarioEncontrado.email.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {usuarioEncontrado.nombre && usuarioEncontrado.apellido
                ? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}`
                : usuarioEncontrado.email}
            </p>
            <p className="text-xs text-gray-500">{usuarioEncontrado.email}</p>
          </div>
        </div>
      )}
      <div className="space-y-2 px-6">
        <Label htmlFor="rolEmpleado">Rol</Label>
        <Input
          id="rolEmpleado"
          type="text"
          placeholder="Colorista, Barbero, Recepcionista..."
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
      </div>
      <div className="space-y-3 rounded-xl border border-gray-200 bg-background/60 mx-6 p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Asignar servicios
          </h3>
          <p className="text-xs text-gray-500">Opcional</p>
        </div>

        <div className="grid gap-2">
          {servicios.map((s) => (
            <label
              key={s.nombre}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={serviciosSeleccionados.some(
                  (selected) => selected.nombre === s.nombre,
                )}
                onChange={() => toggleServicio(s)}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span>{s.nombre}</span>
            </label>
          ))}
        </div>
      </div>
      {mensaje && (
        <p
          className={`text-sm px-8 py-2 rounded-lg border ${
            mensaje.tipo === "success"
              ? "bg-green-100 text-green-700 border-green-700"
              : "bg-[#ef44443f] text-red-600 border-red-600"
          }`}
        >
          {mensaje.texto}
        </p>
      )}
      <div className="fixed bottom-0 right-0  w-sm bg-white flex border-t border-gray-300 py-4 px-6 justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || !usuarioEncontrado}
          className="px-6 py-2.5 rounded-full bg-brand text-white font-medium hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Agregando..." : "Agregar empleado"}
        </button>
      </div>
    </div>
  );
}
