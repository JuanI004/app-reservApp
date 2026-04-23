import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import SearchBar from "../ui/SearchBar";
import Image from "next/image";

const categorias = [
  { value: "todos", label: "Todos" },
  { value: "peluqueria", label: "Peluquería" },
  { value: "restaurante", label: "Restaurante" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "salon de eventos", label: "Salón de eventos" },
  { value: "tatuajes", label: "Tatuajes" },
  { value: "spa", label: "Spa" },
  { value: "clinica", label: "Clínica" },
];

export default function HomeUser() {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [
          { data: authData, error: authError },
          { data: negociosData, error: negociosError },
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("Negocios")
            .select("*")
            .order("created_at", { ascending: true }),
        ]);

        if (authError) throw authError;
        if (negociosError) throw negociosError;

        if (!active) return;

        setNegocios(negociosData || []);
      } catch (e) {
        if (!active) return;
        setError(e?.message || "No se pudieron cargar los datos.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#0f6e56", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen mt-[85px] h-screen flex items-center flex-col justify-center">
        <h2 className="font-display text-[3rem] font-[800]   rounded-lg   flex items-center justify-center text-brand">
          Error
        </h2>
        <div className="font-display text-[2rem] font-[700]   rounded-lg   flex items-center justify-center text-gray-700">
          {error}
        </div>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 cursor-pointer bg-brand text-white rounded-full hover:bg-brand-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px]  mx-auto pt-[105px] h-screen bg-background p-6 space-y-6">
      <section className=" bg-brand rounded-xl shadow p-6 flex flex-col gap-2">
        <p className="text-[#93d1bd] uppercase text-sm">
          Directorio de negocios
        </p>
        <h1 className="text-[1.8rem] font-display font-[800] text-white">
          Encontrá tu <span className="text-[#74dfbd]">próximo turno</span>
        </h1>
        <SearchBar
          value=""
          ubicacion="Montevideo"
          onChange={() => {
            /* Funcionalidad de búsqueda pendiente */
          }}
        />
      </section>
      <section className=" bg-white rounded-xl  p-4 flex flex-wrap items-center  gap-2">
        <p className="text-sm text-[#999]">Categoría</p>
        {categorias.map((cat) => (
          <button
            key={cat.value}
            className={`px-4 h-8 cursor-pointer text-sm ${categoriaSeleccionada === cat.value ? "bg-brand text-white" : "bg-background text-[#666] border border-[#3333332c] hover:bg-brand/10 hover:text-brand hover:border-brand"}   rounded-full  transition-colors `}
            onClick={() => setCategoriaSeleccionada(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </section>
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#666]">
          <span className="font-bold">{negocios.length}</span> negocios
          encontrados
        </p>
        <select
          className="bg-white text-sm text-[#666] border border-[#3333332c] rounded-xl px-4 py-2 focus:outline-none  "
          onChange={() => {
            /* Funcionalidad de orden pendiente */
          }}
        >
          <option value="mejorPuntaje" className="font-sans">
            Mejor puntuados
          </option>
          <option value="recientes" className="font-sans">
            Más recientes
          </option>
          <option value="nombre" className="font-sans">
            Nombre A-Z
          </option>
        </select>
      </div>

      {negocios.length === 0 ? (
        <p className="text-gray-600">No hay negocios cargados.</p>
      ) : (
        <ul className="space-y-3 grid sm:grid-cols-2 md:grid-cols-3  gap-4">
          {negocios.map((negocio) => (
            <li
              key={negocio.id}
              className="relative bg-white h-full w-full rounded-xl "
            >
              <div className="w-full h-32 bg-black relative rounded-t-xl ">
                {negocio.image_url ? (
                  <Image
                    src={negocio.image_url}
                    alt={negocio.nombre || "Sin nombre"}
                    width={300}
                    height={128}
                    className=" absolute -bottom-5 left-5 border-2 border-white  rounded-xl w-15 h-15 object-cover "
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Imagen no disponible</p>
                  </div>
                )}
              </div>
              <div className="pt-6 px-5">
                <p className="font-[800] font-display text-gray-800">
                  {negocio.nombre || "Sin nombre"}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {negocio.categoria || "Sin categoría"}
                </p>
                <p className="text-sm text-gray-500">
                  {negocio.direccion || "Sin dirección"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
