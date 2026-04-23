"use client";

import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Image from "next/image";
import BuscarCiudad from "../ui/BuscarCiudad";

const categorias = [
  { value: "peluqueria", label: "Peluquería" },
  { value: "restaurante", label: "Restaurante" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "salon de eventos", label: "Salón de eventos" },
  { value: "tatuajes", label: "Tatuajes & Piercings" },
  { value: "spa", label: "Spa" },
  { value: "clinica", label: "Clínica" },
];

import { useState } from "react";

export default function Pag1({ nextPage, info, setInfo, handlePrev = null }) {
  const [mensaje, setMensaje] = useState({});
  const [preview, setPreview] = useState(info?.negocio.objectUrl || null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setInfo((prev) => ({
      ...prev,
      negocio: { ...prev.negocio, image: file, objectUrl: objectUrl },
    }));

    setPreview(objectUrl);
    setMensaje((prev) => ({ ...prev, errorImagen: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validarForm()) {
      nextPage(info);
    }
  }
  function validarForm() {
    const newErrores = {};
    if (!info.negocio.image) {
      newErrores.errorImagen = "La imagen del negocio es obligatoria";
    }
    if (!info.negocio.categoria?.trim()) {
      newErrores.errorCategoria = "La categoría del negocio es obligatoria";
    }

    if (!info.negocio.nombre?.trim()) {
      newErrores.errorNombre = "El nombre del negocio es obligatorio";
    }
    if (!info.negocio.telefono?.trim()) {
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
        <h2 className="text-xl text-gray-600 font-display font-bold ">
          Datos de tu negocio
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Esta información va a ser visible en tu página pública de ReservApp.
        </p>
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`border-2 border-brand/50 border-dashed bg-brand/10 w-20 h-20 rounded-xl
  flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer
  hover:border-brand hover:bg-brand-light/30 transition-all duration-200 
  ${mensaje.errorImagen && "border-red-500 bg-red-900/70"}`}
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={80}
                height={80}
                className=" object-cover"
              />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#0f6e56"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z"></path>
                </svg>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => document.getElementById("imagen").click()}
              className="mt-2 p-4 cursor-pointer bg-brand text-white py-2 rounded-full hover:bg-brand/90 transition"
            >
              Subir logo
            </button>
            <p className="text-gray-500">PNG o JPG · máx 2MB</p>
          </div>
        </div>
        <h3 className="text-sm text-gray-700 tracking-widest uppercase mb-2">
          Información básica
        </h3>

        <div className="mb-4">
          <input
            type="file"
            id="imagen"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <section className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del negocio *</Label>
              <Input
                id="nombre"
                placeholder="Nombre del negocio"
                value={info.negocio.nombre}
                onChange={(e) =>
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      nombre: e.target.value,
                    },
                  }))
                }
              />
              {mensaje.errorNombre && (
                <p className="p-2 bg-[#ef44443f] rounded-xl text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorNombre}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <select
                id="categoria"
                className="w-full border bg-background border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                value={info.negocio.categoria}
                onChange={(e) =>
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      categoria: e.target.value,
                    },
                  }))
                }
              >
                <option className="font-sans" value="">
                  Selecciona una categoría
                </option>
                {categorias.map((categoria) => (
                  <option
                    className="font-sans"
                    key={categoria.value}
                    value={categoria.value}
                  >
                    {categoria.label}
                  </option>
                ))}
              </select>
              {mensaje.errorNombre && (
                <p className="p-2 bg-[#ef44443f] rounded-xl text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorNombre}
                </p>
              )}
            </div>
          </section>

          <div className="space-y-2 mt-4">
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              placeholder="Cuéntanos un poco sobre tu negocio"
              className="w-full border bg-background border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              value={info.negocio.descripcion}
              onChange={(e) =>
                setInfo((prev) => ({
                  ...info,
                  negocio: {
                    ...prev.negocio,
                    descripcion: e.target.value,
                  },
                }))
              }
            />
          </div>

          <section className="grid grid-cols-2 gap-2 mt-4">
            <div className="space-y-2 mt-4">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                placeholder="Dirección del negocio"
                value={info.negocio.direccion}
                onChange={(e) =>
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      direccion: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="ciudad">Ciudad / Barrio *</Label>
              <BuscarCiudad
                value={info.negocio.ciudad}
                onConfirm={(value) =>
                  setInfo((prev) => ({
                    ...info,
                    negocio: {
                      ...prev.negocio,
                      ciudad: value,
                    },
                  }))
                }
              />
            </div>
          </section>
          <div className="space-y-2 mt-4">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              placeholder="Número de teléfono"
              value={info.negocio.telefono}
              onChange={(e) =>
                setInfo((prev) => ({
                  ...info,
                  negocio: {
                    ...prev.negocio,
                    telefono: e.target.value,
                  },
                }))
              }
            />
            {mensaje.errorTelefono && (
              <p className="p-2 bg-[#ef44443f] rounded-xl text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorTelefono}
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex mt-6 ${handlePrev ? "justify-between" : "justify-end"}`}
        >
          {handlePrev && (
            <button
              onClick={handlePrev}
              className="px-6 py-2 border border-brand text-brand cursor-pointer rounded-full hover:bg-gray-200 transition"
            >
              {"< Anterior"}
            </button>
          )}
          <Button
            type="submit"
            className="px-6  cursor-pointer bg-brand text-white py-2 rounded-full hover:bg-brand/90 transition"
          >
            {"Siguiente >"}
          </Button>
        </div>
      </form>
    </div>
  );
}
