"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import CrearNegocio from "./CrearNegocio";

const CrearNegocioModalContext = createContext(null);

export function useCrearNegocioModal() {
  return useContext(CrearNegocioModalContext);
}

function infoInicial() {
  return {
    negocio: {
      nombre: "",
      telefono: "",
      direccion: "",
      descripcion: "",
      horarios: [
        { dia: 1, activa: true, desde: "09:00", hasta: "18:00" },
        { dia: 2, activa: true, desde: "09:00", hasta: "18:00" },
        { dia: 3, activa: true, desde: "09:00", hasta: "18:00" },
        { dia: 4, activa: true, desde: "09:00", hasta: "18:00" },
        { dia: 5, activa: true, desde: "09:00", hasta: "18:00" },
        { dia: 6, activa: false, desde: "09:00", hasta: "18:00" },
        { dia: 7, activa: false, desde: "09:00", hasta: "18:00" },
      ],
      tamTurno: 30,
      servicios: [],
      ciudad: "",
      lat: null,
      lng: null,
      image: null,
      objectUrl: null,
    },
  };
}

export function CrearNegocioModalProvider({ children }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [info, setInfo] = useState(infoInicial);
  const [refreshToken, setRefreshToken] = useState(0);

  function abrirCrearNegocio() {
    setInfo(infoInicial());
    setAbierto(true);
  }

  function cerrarCrearNegocio() {
    setAbierto(false);
  }

  async function uploadImageToStorage(file, bucketName, userId) {
    if (!file || !userId) {
      throw new Error("Missing file or user id for upload");
    }
    const extension = file.name.split(".").pop();
    const fileName = `${userId}.${extension}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSubmitNegocio() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No hay usuario");
      return;
    }

    const imageUrlNeg = await uploadImageToStorage(
      info.negocio.image,
      "negocio",
      user.id,
    );

    const { error } = await supabase.from("Negocios").insert([
      {
        idDueño: user.id,
        nombre: info.negocio.nombre,
        telefono: info.negocio.telefono,
        categoria: info.negocio.categoria,
        descripcion: info.negocio.descripcion,
        servicios: info.negocio.servicios,
        horarios: info.negocio.horarios,
        direccion: info.negocio.direccion + ", " + info.negocio.ciudad,
        lat: info.negocio.lat,
        lng: info.negocio.lng,
        image_url: imageUrlNeg,
        tamTurno: info.negocio.tamTurno,
      },
    ]);

    if (error) {
      console.error("Error creando negocio:", error.message);
      return;
    }

    setAbierto(false);
    setRefreshToken((t) => t + 1);
    router.push("/Home");
  }

  return (
    <CrearNegocioModalContext.Provider
      value={{ abrirCrearNegocio, refreshToken }}
    >
      {children}
      {abierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-10 bg-white rounded-lg shadow-lg">
            <button
              type="button"
              onClick={cerrarCrearNegocio}
              aria-label="Cerrar"
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-700"
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
            <CrearNegocio
              info={info}
              setInfo={setInfo}
              handleSubmit={handleSubmitNegocio}
            />
          </div>
        </div>
      )}
    </CrearNegocioModalContext.Provider>
  );
}
