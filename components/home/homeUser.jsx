import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import SearchBar from "../ui/SearchBar";
import { useRouter } from "next/navigation";
import CardNegocio from "../ui/CardNegocio";

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
  const [filtroSeleccionado, setFiltroSeleccionado] = useState({
    categoria: "todos",
    orden: "mejorPuntaje",
    busqueda: "",
  });
  const router = useRouter();

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

  function aplicarFiltros(negocios) {
    let filtrados = [...negocios];
    if (filtroSeleccionado.categoria !== "todos") {
      filtrados = filtrados.filter(
        (neg) => neg.categoria === filtroSeleccionado.categoria,
      );
    }
    if (filtroSeleccionado.busqueda) {
      const busquedaLower = filtroSeleccionado.busqueda.toLowerCase();
      filtrados = filtrados.filter(
        (neg) => neg.nombre && neg.nombre.toLowerCase().includes(busquedaLower),
      );
    }
    if (filtroSeleccionado.orden === "mejorPuntaje") {
      filtrados.sort((a, b) => (b.puntaje || 0) - (a.puntaje || 0));
    } else if (filtroSeleccionado.orden === "recientes") {
      filtrados.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filtroSeleccionado.orden === "nombre") {
      filtrados.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    }
    return filtrados;
  }

  const negociosFiltrados = aplicarFiltros(negocios);

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
          ubicacion="Montevideo"
          onClick={(value) => {
            setFiltroSeleccionado({
              ...filtroSeleccionado,
              busqueda: value,
            });
          }}
        />
      </section>
      <section className=" bg-white rounded-xl  p-4 flex flex-wrap items-center  gap-2">
        <p className="text-sm text-[#999]">Categoría</p>
        {categorias.map((cat) => (
          <button
            key={cat.value}
            className={`px-4 h-8 cursor-pointer text-sm ${filtroSeleccionado.categoria === cat.value ? "bg-brand text-white" : "bg-background text-[#666] border border-[#3333332c] hover:bg-brand/10 hover:text-brand hover:border-brand"}   rounded-full  transition-colors `}
            onClick={() =>
              setFiltroSeleccionado({
                ...filtroSeleccionado,
                categoria: cat.value,
              })
            }
          >
            {cat.label}
          </button>
        ))}
      </section>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="text-sm text-[#666]">
            <span className="font-bold">{negociosFiltrados.length}</span>{" "}
            negocios encontrados
          </p>
          {filtroSeleccionado.busqueda && (
            <>
              <p className="text-sm text-[#666]">|</p>
              <p className="text-sm text-[#666]">Busqueda:</p>
              <div className="px-2 h-8  flex gap-4 justify-between items-center  rounded-full text-sm border bg-brand/10 text-brand border-brand">
                <p>{filtroSeleccionado.busqueda}</p>
                <button
                  onClick={() =>
                    setFiltroSeleccionado({
                      ...filtroSeleccionado,
                      busqueda: "",
                    })
                  }
                  className="text-xl mb-0.5 cursor-pointer text-brand hover:text-brand-dark transition-colors"
                >
                  x
                </button>
              </div>
            </>
          )}
        </div>
        <select
          className="bg-white text-sm text-[#666] border border-[#3333332c] rounded-xl px-4 py-2 focus:outline-none  "
          onChange={(event) => {
            setFiltroSeleccionado({
              ...filtroSeleccionado,
              orden: event.target.value,
            });
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

      {negociosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay negocios cargados.</p>
      ) : (
        <ul className="space-y-3 grid sm:grid-cols-2 md:grid-cols-3  gap-4">
          {negociosFiltrados.map((negocio) => (
            <li
              key={negocio.id}
              onClick={() => router.push(`/negocio/${negocio.idNegocio}`)}
              className="h-full hover:shadow-lg hover:scale-105 transition-all rounded-xl"
            >
              <CardNegocio negocio={negocio} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
