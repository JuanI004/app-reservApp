import Image from "next/image";
export default function Pag4({ nextPage, info, setInfo, prevPage }) {
  function getDiaSemana(dia) {
    const dias = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    return dias[dia - 1] || "Día no válido";
  }
  return (
    <div className="w-full h-full flex flex-col  z-10">
      <h2 className="text-xl text-gray-600 font-display font-bold ">
        Revisá y publicá
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Así va a quedar tu página. Podés editar todo después desde el dashboard
      </p>
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <div className="w-full px-6 py-4 border border-gray-200 bg-background rounded-lg flex flex-col  gap-2">
          <p className="text-gray-500 mb-2 uppercase text-xs tracking-widest">
            Vista previa
          </p>
          <div className="flex gap-4">
            {info.negocio?.objectUrl ? (
              <Image
                src={info.negocio.objectUrl}
                alt="Logo del negocio"
                width={100}
                height={100}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-brand flex justify-center items-center rounded-xl">
                <span className="text-white font-bold uppercase text-sm">
                  Logo
                </span>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg text-black font-display font-bold">
                {info.negocio?.nombre || "Nombre del negocio"}
              </h3>
              <p className="text-gray-500 text-sm capitalize">
                <span className="text-brand">
                  {info.negocio?.categoria || "Categoría"} ·{" "}
                </span>
                {info.negocio?.ciudad || "Ciudad"},{" "}
                {info.negocio?.direccion || "Dirección"}
              </p>
            </div>
          </div>
          <h2 className="text-gray-500 text-sm mt-4">Descripcion: </h2>
          <p className="text-black text-sm italic">
            {info.negocio?.descripcion || "Descripción del negocio"}
          </p>
        </div>
        <section className="w-full grid grid-cols-2 gap-4">
          <div className="w-full px-6 py-3  border border-gray-200 bg-background rounded-xl flex flex-col  gap-2">
            <h3 className="text-lg text-brand font-display font-bold">
              Servicios
            </h3>
            <ul className="text-gray-500 text-sm">
              {info.negocio?.servicios?.length > 0 ? (
                info.negocio.servicios.map((s, i) => (
                  <li key={i}>
                    {s.nombre} - {s.duracion} min - ${s.precio}
                  </li>
                ))
              ) : (
                <li>No has agregado servicios</li>
              )}
            </ul>
          </div>
          <div className="w-full px-6 py-3 border border-gray-200 bg-background rounded-xl flex flex-col  gap-2">
            <h3 className="text-lg text-brand font-display font-bold">
              Horarios
            </h3>
            <ul className="text-gray-500 text-sm">
              {info.negocio?.horarios?.length > 0 ? (
                info.negocio.horarios.map((h, i) => (
                  <li key={i}>
                    {h.activa &&
                      getDiaSemana(h.dia) + ": " + h.desde + " - " + h.hasta}
                  </li>
                ))
              ) : (
                <li>No has agregado horarios</li>
              )}
            </ul>
          </div>
        </section>
      </div>
      <div className=" flex gap-2 mt-4 rounded-xl text-sm w-full p-2 border border-brand/40 bg-background-light text-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="#0f6e56"
          viewBox="0 0 256 256"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
        </svg>
        <p>
          Tu página va a estar activa en reservapp ni bien confirmes. Podés
          pausarla o modificarla en cualquier momento desde el panel de
          administración.
        </p>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={prevPage}
          className="px-6 py-2 border border-brand text-brand cursor-pointer rounded-full hover:bg-gray-200 transition"
        >
          {"< Anterior"}
        </button>
        <button
          onClick={nextPage}
          className="px-6 py-2 bg-brand cursor-pointer text-white rounded-full hover:bg-brand/90 transition"
        >
          {"Terminar >"}
        </button>
      </div>
    </div>
  );
}
