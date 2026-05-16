"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

export default function AgregarEmpleado({ idNegocio }) {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

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
      setUsuarioEncontrado(null);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Agregar empleado</h2>
      <div>
        <p className="text-sm font-semibold mb-1">Email del empleado</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="empleado@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setUsuarioEncontrado(null);
              setMensaje(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && buscarUsuario()}
            className="flex-1 border p-2 text-sm"
          />
          <button
            onClick={buscarUsuario}
            disabled={buscando || !email.trim()}
            className="px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>
      {usuarioEncontrado && (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
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
      <input
        type="text"
        placeholder="Rol (ej: Colorista, Barbero)"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        className="w-full border p-2 text-sm"
      />
      {mensaje && (
        <p
          className={`text-sm p-2 rounded-lg border ${
            mensaje.tipo === "success"
              ? "bg-green-100 text-green-700 border-green-700"
              : "bg-[#ef44443f] text-red-600 border-red-600"
          }`}
        >
          {mensaje.texto}
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || !usuarioEncontrado}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Agregando..." : "Agregar empleado"}
      </button>
    </div>
  );
}
