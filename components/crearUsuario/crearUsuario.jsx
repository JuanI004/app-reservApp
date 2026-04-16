import { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Image from "next/image";

export default function CrearUsuario({
  info,
  setInfo,
  handleSubmit,
  final = false,
}) {
  const [mensaje, setMensaje] = useState({});
  const [preview, setPreview] = useState(info?.objectUrl || null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setInfo((prev) => ({ ...prev, image: file, objectUrl: objectUrl }));
    setPreview(objectUrl);
    setMensaje((prev) => ({ ...prev, errorImagen: null }));
  }

  function validarForm() {
    const newErrores = {};
    if (!info.nombre?.trim()) {
      newErrores.errorNombre = "El nombre del negocio es obligatorio";
    }
    if (!info.apellido?.trim()) {
      newErrores.errorApellido = "El apellido es obligatorio";
    }
    if (!info.image) {
      newErrores.errorImagen = "La imagen del negocio es obligatoria";
    }
    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }
  function handleTerminar(e) {
    e.preventDefault();
    console.log(info);
    if (validarForm()) {
      handleSubmit();
    }
  }
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <div
        onClick={() => document.getElementById("imagen").click()}
        className={`border-2 border-[#2563EB] w-45 h-45 rounded-lg 
          flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer relative
          hover:border-[#2563EB] hover:bg-[#1a3a60]/30 transition-all duration-200 
          ${mensaje.errorImagen && "border-red-500 hover:border-red-500 hover:bg-red-900/70 bg-red-900/70"}`}
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
              fill={mensaje.errorImagen ? "#ef4444" : "#2563EB"}
              viewBox="0 0 256 256"
            >
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path>
            </svg>
            <p
              className={`px-4 text-center text-[#2563EB] text-xl ${mensaje.errorImagen && "text-red-600"}`}
            >
              Seleccionar imagen de perfil
            </p>
          </>
        )}
      </div>
      {mensaje.errorImagen && (
        <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
          {mensaje.errorImagen}
        </p>
      )}
      <form className="w-full" onSubmit={handleTerminar}>
        <h2 className="text-xl text-gray-600 font-bold mb-4"></h2>
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
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              value={info?.nombre ?? ""}
              onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
            />
            {mensaje.errorNombre && (
              <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorNombre}
              </p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              id="apellido"
              placeholder="Apellido"
              value={info?.apellido ?? ""}
              onChange={(e) => setInfo({ ...info, apellido: e.target.value })}
            />
            {mensaje.errorApellido && (
              <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorApellido}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="mt-2 p-4 cursor-pointer bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition"
          >
            {final ? "Terminar" : "Siguiente"}
          </Button>
        </div>
      </form>
    </div>
  );
}
