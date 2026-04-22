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
      servicios: [],
      ciudad: "",
      image: null,
      tamTurno: 30,
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
        return;
      } else {
        setSession(data.session);
      }
      supabase
        .from("Duenos")
        .select("nuevo")
        .eq("idDueño", data.session.user.id)
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
    console.log(info);
    const currentInfo = {
      negocio: info?.negocio ?? {},
      usuario: info?.usuario ?? {},
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No hay usuario");
      return;
    }

    if (!currentInfo.negocio.image || !currentInfo.usuario.image) {
      console.error("Faltan imagenes de perfil o negocio");
      return;
    }

    let imageUrlNeg = await uploadImageToStorage(
      currentInfo.negocio.image,
      "negocio",
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
        image_url: imageUrlNeg,
        tamTurno: info.negocio.tamTurno,
      },
    ]);
    let imageUrlUser = await uploadImageToStorage(
      currentInfo.usuario.image,
      "perfiles",
    );
    const { error: dueñoError } = await supabase
      .from("Duenos")
      .update({
        email: user.email,
        nombre: currentInfo.usuario.nombre,
        apellido: currentInfo.usuario.apellido,
        image_url: imageUrlUser,
        nuevo: false,
      })
      .eq("idDueño", user.id);
    if (error) {
      console.error(
        "Error completo:",
        error ? error.message : dueñoError.message,
      );
      console.error("Mensaje:", error ? error.message : dueñoError.message);
    }
    router.push("/home");
  }

  async function handleSubmitUsuario() {
    setEtapa(2);
    console.log(info);
  }

  return (
    <div className=" overflow-scroll min-h-screen pt-[76px] flex flex-col gap-6 items-center justify-center bg-secondary/30">
      <div>
        <h2 className="text-xl text-black text-[1.5rem] font-display font-[800]  ">
          Completa tu información
        </h2>
        <p className="text-gray-400 text-lg mb-4">
          Completá los datos y empezá a recibir reservas en minutos. Es gratis.
        </p>
      </div>

      <main className="w-full p-10 bg-white  max-w-2xl rounded-xl shadow-lg">
        {etapa === 1 ? (
          <CrearUsuario
            info={info}
            setInfo={setInfo}
            handleSubmit={handleSubmitUsuario}
          />
        ) : (
          <CrearNegocio
            info={info}
            setInfo={setInfo}
            handleSubmit={handleSubmitNegocio}
            handlePrev={() => setEtapa(1)}
            first={false}
          />
        )}
      </main>
    </div>
  );
}
