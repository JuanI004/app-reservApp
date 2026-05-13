import { useEffect, useState } from "react";
import Image from "next/image";

const equipoPlaceholder = [
  {
    icon: "JS",
    nombre: "Juan Sanchez",
    cargo: "Desarrollador",
    color: "#1d9e75",
  },
  {
    icon: "MS",
    nombre: "Maria Sanchez",
    cargo: "Atención al cliente",
    color: "#378add",
  },
  {
    icon: "RS",
    nombre: "Rosa Sanchez",
    cargo: "Administración",
    color: "#D85A30",
  },
];

const reseñas = [
  {
    id: 1,
    nombre: "Carolina A.",
    rating: 5,
    tiempo: "hace 2 días",
    texto:
      "Excelente atención, Juan es increíble. Salí re contenta con el resultado.",
  },
  {
    id: 2,
    nombre: "Juan M.",
    rating: 5,
    tiempo: "hace 1 semana",
    texto:
      "Rosa me atendió muy bien. El sistema de turnos online es muy práctico, sin filas.",
  },
  {
    id: 3,
    nombre: "Sofía L.",
    rating: 4,
    tiempo: "hace 2 semanas",
    texto: "El lugar es muy lindo y el ambiente agradable. Volveré sin dudas.",
  },
];

export default function NegocioUserPage({ negocio, session }) {
  const INFO = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="24"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
        </svg>
      ),
      text: ` ${negocio?.direccion || "Dirección"}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="24"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
        </svg>
      ),
      text: `Abre a las ${negocio?.horarios?.find((h) => h.activa)?.desde || "00:00"}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="24"
          fill="#1d9e75"
          viewBox="0 0 256 256"
        >
          <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
        </svg>
      ),
      text: negocio?.telefono
        ? `${negocio.telefono}`
        : "Sin teléfono registrado",
    },
  ];
  const infoDelDia = [
    {
      title: "Estado",
      value: "Abierto ahora",
      color: "#1d9e75",
    },
    {
      title: "Turnos hoy",
      value: "8 disponibles",
    },
    {
      title: "Espera aprox.",
      value: "~10 min",
    },
  ];
  console.log(negocio);

  const weekDates = (() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - diffToMonday);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  })();

  return (
    <>
      <span className="w-screen h-70 bg-black"></span>
      <div className="relative max-w-[820px] w-full mx-auto ">
        {negocio?.image_url ? (
          <Image
            src={negocio.image_url}
            alt={negocio.nombre || "Sin nombre"}
            width={300}
            height={128}
            className=" absolute -top-20 left-5   border-2 border-white  rounded-xl w-25 h-25 object-cover "
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Imagen no disponible</p>
          </div>
        )}
        <h1 className="text-3xl font-display font-[800] mt-10">
          {negocio?.nombre}
        </h1>
        <p className="text-gray-600 capitalize mt-2">{negocio?.categoria}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          {INFO.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm ">
              <div className="text-brand-light">{item.icon}</div>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-8">
          {infoDelDia.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4  border border-gray-200 rounded-xl"
            >
              <h3 className="uppercase text-xs text-gray-500">{item.title}</h3>
              <p className="text-sm mt-1" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <main className="grid grid-cols-1 sm:grid-cols-[6fr_4fr] gap-6 mt-8">
          <section className="flex flex-col gap-6">
            <div className="bg-white p-4  border border-gray-200 rounded-xl">
              <h2 className="font-display font-[700]">Sobre el negocio</h2>
              <p className="text-gray-500 text-sm mt-2">
                {negocio?.descripcion ||
                  "Este negocio no ha proporcionado una descripción."}
              </p>
            </div>
            <div className="bg-white p-4  border border-gray-200 rounded-xl">
              <h2 className="font-display font-[700]">Nuestro Equipo</h2>
              <div className="mt-4 flex flex-col gap-4">
                {equipoPlaceholder.map((miembro, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full bg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: miembro.color }}
                    >
                      {miembro.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{miembro.nombre}</p>
                      <p className="text-xs text-gray-500">{miembro.cargo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white  border border-gray-200 rounded-xl">
              <div className="w-full flex justify-center items-center h-40 bg-[#f3f2f1]">
                <span className="rounded-full flex justify-center items-center bg-brand h-10 w-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#ffffff"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
                  </svg>
                </span>
              </div>
              <div className="w-full p-4">
                <h3 className=" text-sm">{negocio?.direccion.split(",")[0]}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {negocio?.direccion.split(",").slice(1).join(",") ||
                    "Sin dirección completa"}
                </p>
              </div>
            </div>
            <div className="bg-white p-4  border border-gray-200 rounded-xl">
              <h2 className="font-display font-[700]">Reseñas</h2>
              <div className="mt-4 flex flex-col gap-4">
                {reseñas.map((reseña) => (
                  <div
                    key={reseña.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#d1d1d1] flex items-center justify-center text-gray-700 font-medium">
                        {reseña.nombre.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{reseña.nombre}</p>
                        <p className="text-xs text-gray-500">{reseña.tiempo}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{reseña.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section>
            <div className="sm:sticky bg-white p-4  border border-gray-200 rounded-xl">
              <h2 className="font-display font-[700] mb-2">Reservar turno</h2>
              <p className="text-gray-500 uppercase text-xs mb-4">
                1 · Servicio
              </p>
              <div className="flex flex-col gap-4">
                {negocio?.servicios.map((servicio) => (
                  <button
                    key={servicio.id}
                    className="w-full flex cursor-pointer justify-between items-center text-sm text-left px-4 py-2 bg-background border border-gray-300 rounded-xl hover:bg-brand/10 hover:border-brand transition-colors"
                  >
                    <div>
                      <p>{servicio.nombre} </p>
                      <p className="text-xs text-gray-500 ">
                        {servicio.duracion} min
                      </p>
                    </div>

                    <p className="text-sm text-brand">${servicio.precio}</p>
                  </button>
                ))}
              </div>
              <p className="text-gray-500 uppercase text-xs my-4">
                2 · Profesional
              </p>
              <div className="flex  gap-4">
                {equipoPlaceholder.map((miembro, index) => (
                  <button
                    key={index}
                    className="w-full flex flex-col  cursor-pointer justify-center items-center text-sm text-center px-4 py-2 bg-background border border-gray-300 rounded-xl hover:bg-brand/10 hover:border-brand transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg flex items-center justify-center text-white font-bold mb-1"
                      style={{ backgroundColor: miembro.color }}
                    >
                      {miembro.icon}
                    </div>
                    <p className="text-xs">{miembro.nombre}</p>
                  </button>
                ))}
              </div>
              <p className="text-gray-500 uppercase text-xs my-4">3 · Fecha</p>
              <div className="flex  gap-1">
                {weekDates.map((dateObj, idx) => {
                  const diaNumero = idx + 1; // 1=Lunes .. 7=Domingo (coincide con Pag2)
                  const horario = negocio?.horarios?.find(
                    (h) => h?.dia === diaNumero,
                  );

                  if (!horario?.activa) return null;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateCopy = new Date(dateObj);
                  dateCopy.setHours(0, 0, 0, 0);
                  const isToday = dateCopy.getTime() === today.getTime();
                  const isPast = dateCopy.getTime() < today.getTime();

                  const baseClasses =
                    "flex flex-col cursor-pointer justify-center items-center text-sm text-center p-2 px-3 rounded-xl transition-colors ";
                  const activeFutureClasses =
                    "bg-background border border-gray-300 hover:bg-brand/10 hover:border-brand";
                  const todayClasses =
                    "bg-brand text-white border border-brand ";
                  const pastClasses =
                    "opacity-50 bg-transparent border border-transparent cursor-not-allowed";

                  const appliedClasses = isToday
                    ? `${baseClasses} ${todayClasses}`
                    : isPast
                      ? `${baseClasses} ${pastClasses}`
                      : `${baseClasses} ${activeFutureClasses}`;

                  return (
                    <button
                      key={idx}
                      className={appliedClasses}
                      disabled={isPast}
                      aria-pressed={isToday}
                      title={isPast ? "Día pasado" : "Seleccionar día"}
                    >
                      <label className="">
                        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][idx]}
                      </label>
                      <p className="font-display font-extrabold">
                        {dateObj.getDate()}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="text-gray-500 uppercase text-xs my-4">
                4 · Horario
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
