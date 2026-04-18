"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CrearNegocio from "../../../components/crearNegocio/CrearNegocio";
import CrearUsuario from "../../../components/crearUsuario/crearUsuario";
import { supabase } from "../../../lib/supabase";

export default function CrearCuentaDueño() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [info, setInfo] = useState({
    nombre: "",
    apellido: "",
    image: null,
    objectUrl: null,
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
        .from("Clientes")
        .select("nuevo")
        .eq("idCliente", data.session.user.id)
        .then(({ data, error }) => {
          if (error) {
            router.push("/login");
          } else if (data[0]?.nuevo === false) {
            router.push("/");
          }
        });
    });
  }, [router]);

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

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No hay usuario");
      return;
    }

    let imageUrlUser = await uploadImageToStorage(info.image, "perfiles");
    const { error: dueñoError } = await supabase
      .from("Clientes")
      .update({
        email: user.email,
        nombre: info.nombre,
        apellido: info.apellido,
        image_url: imageUrlUser,
        nuevo: false,
      })
      .eq("idCliente", user.id);
    if (error) {
      console.error(
        "Error completo:",
        error ? error.message : dueñoError.message,
      );
      console.error("Mensaje:", error ? error.message : dueñoError.message);
    }
  }

  return (
    <div className="min-h-screen pt-[76px] bg-gray-200 flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white  max-w-md rounded-lg shadow-lg">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold text-black">Agrega tus datos</h1>
          <p className="text-sm  text-gray-400">
            Completa la información para crear tu cuenta
          </p>
        </div>
        <CrearUsuario
          info={info}
          setInfo={setInfo}
          handleSubmit={handleSubmit}
          final={true}
        />
      </main>
    </div>
  );
}
