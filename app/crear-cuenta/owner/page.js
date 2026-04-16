"use client";

import { useState } from "react";
import Pag1 from "../../../components/crearNegocio/Pag1";
import Pag2 from "../../../components/crearNegocio/Pag2";
import { supabase } from "../../../lib/supabase";

export default function CrearCuentaDueño() {
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    image: null,
    objectUrl: null,
  });

  function handleNextPag(data) {
    setInfo({ ...info, ...data });
    setPage(page + 1);
    if (page === 2) {
      handleSubmit();
    }
  }

  /*function handleSubmit() {
    console.log(info);
  }*/

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No hay usuario");
      return;
    }

    const { error } = await supabase.from("Negocios").insert([
      {
        user_id: user.id,
        nombre: info.nombre,
        telefono: info.telefono,
        direccion: info.direccion,
      },
    ]);

    if (error) {
      console.error("Error completo:", error);
      console.error("Mensaje:", error.message);
    }
  }

  return (
    <div className="min-h-screen pt-[76px] bg-gray-200 flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white max-w-md rounded-lg shadow-lg">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold text-black">
            Agrega los datos de tu negocio
          </h1>
          <p className="text-sm  text-gray-400">
            Completa la información para agregar tu negocio a ReservApp
          </p>
        </div>
        {page === 1 && (
          <Pag1
            info={info}
            setInfo={setInfo}
            nextPage={() => handleNextPag(info)}
          />
        )}
        {page === 2 && (
          <Pag2
            info={info}
            setInfo={setInfo}
            nextPage={() => handleNextPag(info)}
            prevPage={() => setPage(page - 1)}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
