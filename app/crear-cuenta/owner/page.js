"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CrearNegocio from "../../../components/crearNegocio/CrearNegocio";
import CrearUsuario from "../../../components/crearUsuario/crearUsuario";
import { supabase } from "../../../lib/supabase";

export default function CrearCuentaDueño() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const [session, setSession] = useState(null);
  const [info, setInfo] = useState({
    negocio: {
      nombre: "",
      telefono: "",
      direccion: "",
      image: null,
      objectUrl: null,
    },
    usuario: {
      nombre: "",
      apellido: "",
      image: null,
      objectUrl: null,
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setSession(null);
        router.push("/login");
      } else {
        setSession(data.session);
      }
      supabase
        .from("Duenos")
        .select("nuevo")
        .eq("user_id", data.session.user.id)
        .then(({ data, error }) => {
          if (error) {
            router.push("/login");
          } else if (data[0]?.nuevo === false) {
            router.push("/");
          }
        });
    });
  }, [router]);

  /*function handleSubmit() {
    console.log(info);
  }*/

  async function uploadImageToStorage(file, bucketName) {
    const extension = file.name.split(".").pop();
    const fileName = `${session.user.id}.${extension}`;

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
    let imageUrlNeg = await uploadImageToStorage(info.negocio.image, "negocio");
    const { error } = await supabase.from("Negocios").insert([
      {
        user_id: user.id,
        nombre: info.negocio.nombre,
        telefono: info.negocio.telefono,
        direccion: info.negocio.direccion,
        image_url: imageUrlNeg,
      },
    ]);
    let imageUrlUser = await uploadImageToStorage(
      info.usuario.image,
      "perfiles",
    );
    const { error: dueñoError } = await supabase
      .from("Duenos")
      .update({
        email: user.email,
        nombre: info.usuario.nombre,
        apellido: info.usuario.apellido,
        image_url: imageUrlUser,
        nuevo: false,
      })
      .eq("user_id", user.id);
    if (error) {
      console.error(
        "Error completo:",
        error ? error.message : dueñoError.message,
      );
      console.error("Mensaje:", error ? error.message : dueñoError.message);
    }
  }

  async function handleSubmitUsuario() {
    setEtapa(2);
  }

  return (
    <div className="min-h-screen pt-[76px] bg-gray-200 flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white  max-w-md rounded-lg shadow-lg">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold text-black">
            {etapa === 1
              ? "Agrega tus datos"
              : "Agrega los datos de tu negocio"}
          </h1>
          <p className="text-sm  text-gray-400">
            {etapa === 1
              ? "Completa la información para crear tu cuenta"
              : "Completa la información para agregar tu negocio a ReservApp"}
          </p>
        </div>
        {etapa === 1 ? (
          <CrearUsuario
            info={info.usuario}
            setInfo={setInfo}
            handleSubmit={handleSubmitUsuario}
          />
        ) : (
          <CrearNegocio
            info={info.negocio}
            setInfo={setInfo}
            handleSubmit={handleSubmitNegocio}
          />
        )}
      </main>
    </div>
  );
}
