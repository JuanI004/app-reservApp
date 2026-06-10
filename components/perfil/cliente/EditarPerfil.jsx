import { useState } from "react";
import Label from "../../ui/Label";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Image from "next/image";

export default function EditarPerfil({ userInfo, session, onClose, onSubmit }) {
  const [info, setInfo] = useState(() => userInfo || {});
  const [mensaje, setMensaje] = useState({});
  const [preview, setPreview] = useState(
    info?.objectUrl || info?.image_url || userInfo?.image_url || null,
  );

  function updateUsuarioInfo(patch) {
    setInfo((prev) => ({ ...prev, ...patch }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    updateUsuarioInfo({ image: file, objectUrl: objectUrl });
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
    if (!info.image && !info.image_url) {
      newErrores.errorImagen = "La imagen del negocio es obligatoria";
    }
    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }

  function normalizeValue(value) {
    return typeof value === "string" ? value.trim() : (value ?? "");
  }

  function hasChanges() {
    if (info?.image) return true;

    return (
      normalizeValue(info?.nombre) !== normalizeValue(userInfo?.nombre) ||
      normalizeValue(info?.apellido) !== normalizeValue(userInfo?.apellido) ||
      normalizeValue(info?.image_url) !== normalizeValue(userInfo?.image_url)
    );
  }

  function handleTerminar(e) {
    e.preventDefault();

    if (!hasChanges()) {
      onClose && onClose();
      return;
    }

    if (validarForm()) {
      if (onSubmit) {
        onSubmit(info);
      }
    }
  }

  return (
    <>
      <div className="w-full flex items-start justify-between">
        <h2 className="text-xl text-gray-600 font-display font-bold ">
          Editar tu cuenta
        </h2>
        <button
          type="button"
          onClick={() => onClose && onClose()}
          aria-label="Cerrar"
          className="transition-all cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Esta información va a ser visible en tu página pública de ReservApp.
      </p>{" "}
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <div
          onClick={() => document.getElementById("imagen").click()}
          className={`border-2 border-brand/50 border-dashed bg-brand/10 w-45 h-45 rounded-lg 
          flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer relative
          hover:border-brand hover:bg-brand/30 transition-all duration-200 
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
                fill={mensaje.errorImagen ? "#ef4444" : "#0f6e56"}
                viewBox="0 0 256 256"
              >
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path>
              </svg>
              <p
                className={`px-4 text-center text-brand text-xl ${mensaje.errorImagen && "text-red-600"}`}
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
                onChange={(e) => {
                  setMensaje((prev) => ({ ...prev, errorNombre: null }));
                  updateUsuarioInfo({ nombre: e.target.value });
                }}
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
                onChange={(e) => {
                  setMensaje((prev) => ({ ...prev, errorApellido: null }));
                  updateUsuarioInfo({ apellido: e.target.value });
                }}
              />
              {mensaje.errorApellido && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorApellido}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-brand cursor-pointer text-white rounded-full hover:bg-brand/90 transition"
            >
              Terminar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
