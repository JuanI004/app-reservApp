import Image from "next/image";
export default function Pag4({ nextPage, info, setInfo, prevPage }) {
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
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-brand flex justify-center items-center rounded-lg">
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
          {info.negocio?.servicios?.length > 0 && (
            <div className="w-full ">
              <ul className="text-gray-500 flex text-sm gap-2 ">
                {info.negocio.servicios.map((s, i) => (
                  <li
                    key={i}
                    className="bg-[#e1f5ee] text-brand text-sm px-2 py rounded-full"
                  >
                    {s.nombre} - {s.duracion} min
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="text-gray-500 text-sm mt-4">Descripcion: </h2>
          <p className="text-black text-sm italic">
            {info.negocio?.descripcion || "Descripción del negocio"}
          </p>
        </div>
        <div className="w-full p-6 border border-gray-200 bg-background rounded-lg flex flex-col justify-center items-center gap-4">
          <h3 className="text-lg text-gray-700 font-display font-bold">
            Servicios
          </h3>
          <ul className="text-gray-500 text-sm">
            {info.negocio?.servicios?.length > 0 ? (
              info.negocio.servicios.map((s, i) => (
                <li key={i}>
                  {s.nombre} - {s.duracion} min
                </li>
              ))
            ) : (
              <li>No has agregado servicios</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
