"use client";

import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { useState } from "react";

export default function Pag1({ nextPage, info, setInfo }) {
  const [mensaje, setMensaje] = useState({});

  function validarForm() {
    const newErrores = {};
    if (!info.nombre?.trim()) {
      newErrores.errorNombre = "El nombre del negocio es obligatorio";
    }
    if (!info.telefono?.trim()) {
      newErrores.errorTelefono = "El teléfono es obligatorio";
    }
    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(info);
    if (validarForm()) {
      nextPage(info);
    }
  }
  return (
    <div className="w-full h-full flex items-center z-10">
      <form className="w-full" onSubmit={handleSubmit}>
        <h2 className="text-xl text-gray-600 font-bold mb-4">
          Paso 1: Información del negocio
        </h2>
        <div className="mb-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del negocio *</Label>
            <Input
              id="nombre"
              placeholder="Nombre del negocio"
              value={info.nombre}
              onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
            />
            {mensaje.errorNombre && (
              <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorNombre}
              </p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Dirección del negocio"
              value={info.direccion}
              onChange={(e) => setInfo({ ...info, direccion: e.target.value })}
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              placeholder="Número de teléfono"
              value={info.telefono}
              onChange={(e) => setInfo({ ...info, telefono: e.target.value })}
            />
            {mensaje.errorTelefono && (
              <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorTelefono}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="mt-2 p-4 cursor-pointer bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition"
          >
            Siguiente
          </Button>
        </div>
      </form>
    </div>
  );
}
