"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { useState } from "react";

export default function Pag2({ info, setInfo, prevPage, nextPage }) {
  const [preview, setPreview] = useState(info?.objectUrl || null);
  const [mensaje, setMensaje] = useState({});

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

  function validarForm() {
    const newErrores = {};
    if (!info.negocio.image) {
      newErrores.errorImagen = "La imagen del negocio es obligatoria";
    }
    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validarForm()) {
      nextPage(info);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center ">
      <h2 className="text-xl text-gray-600 font-bold mb-4">
        Paso 2: Imagen del negocio
      </h2>
      <div
        onClick={() => document.getElementById("imagen").click()}
        className={`border-2 border-[#2563EB] w-45 h-45 rounded-lg 
  flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer
  hover:border-[#2563EB] hover:bg-[#1a3a60]/30 transition-all duration-200 
  ${mensaje.errorImagen && "border-red-500 bg-red-900/70"}`}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={260}
            height={260}
            className=" object-cover"
          />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="52"
              fill="#2563EB"
              viewBox="0 0 256 256"
            >
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path>
            </svg>
            <p className="px-4 text-center text-[#2563EB] text-xl">
              Seleccionar imagen
            </p>
          </>
        )}
      </div>
      <form className="w-full" onSubmit={nextPage}>
        <div className="mb-4">
          <div className="space-y-2">
            <input
              type="file"
              id="imagen"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={prevPage}
            className="mt-2 p-4 cursor-pointer bg-[#757575] text-white py-2 rounded-lg hover:bg-[#4d4d4d] transition"
          >
            Anterior
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="mt-2 p-4 cursor-pointer bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition"
          >
            Terminar
          </Button>
        </div>
      </form>
    </div>
  );
}
