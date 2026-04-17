// components/HomeOwner.jsx
"use client";

import CrearNegocio from "../crearNegocio/CrearNegocio";
import Button from "../ui/Button";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import NegociosOwner from "../NegociosOwner";



export default function HomeOwner() {
    const [creando, setCreando] = useState(false);
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
        /*let imageUrlNeg = await uploadImageToStorage(info.negocio.image, "negocio");*/
        const { error } = await supabase.from("Negocios").insert([
        {
            idDueño: user.id,
            nombre: info.negocio.nombre,
            telefono: info.negocio.telefono,
            direccion: info.negocio.direccion,
            image_url: 'https://tuimagen.com/default.png',
        },
        ]);
        /*let imageUrlUser = await uploadImageToStorage(
        info.usuario.image,
        "perfiles",
        );*/
        const { error: dueñoError } = await supabase.from("Duenos")
        .update({
            email: user.email,
            nombre: info.usuario.nombre,
            apellido: info.usuario.apellido,
            image_url: 'https://tuimagen.com/default.png',
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
        else {
            console.log("Negocio creado exitosamente");
            close();
        }
    }

    
  return (
    <>
        <div className="min-h-screen bg-gray-100 mt-20 p-6">
        <h1 className="text-2xl font-bold text-black">Panel del Owner</h1>
        {/*Info del owner*/}
        <Button onClick={() => {
            console.log("click");
            setCreando(true);

        }} className="mt-4 text-black">
            Crear nuevo negocio
        </Button>
        <NegociosOwner />
        </div>
        {creando && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
                <CrearNegocio
                    onClose={() => setCreando(false)}
                    info={info}
                    setInfo={setInfo}
                    handleSubmit={handleSubmitNegocio}
                />
                </div>
        </div>
        )}
        
    </>
  );
}