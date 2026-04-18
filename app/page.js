import features from "../utils/features";

const MOCKUP_INFO = [
  {
    icon: "MG",
    nombre: "Maria Garcia",
    hora: "09:00",
    color: "#0F6E56",
  },
  {
    icon: "JP",
    nombre: "Juan Perez",
    hora: "10:00",
    color: "#D85A30",
  },
  {
    icon: "LC",
    nombre: "Lucia Castro",
    hora: "11:00",
    color: "#5DCAA5",
  },
  {
    icon: "RS",
    nombre: "Rosa Sanchez",
    hora: "12:00",
    color: "#378ADD",
  },
];

const PASOS = {
  "01": {
    title: "Registrá tu negocio",
    description:
      "Creá tu cuenta, cargá la info de tu negocio y configurá tus servicios en minutos.",
  },
  "02": {
    title: "Agregá tus empleados",
    description:
      "Sumá a tu equipo con sus horarios y servicios. Cada uno tendrá su propia disponibilidad.",
  },
  "03": {
    title: "Empezá a recibir turnos",
    description:
      "Compartí tu link y tus clientes empezarán a reservar las 24hs del día.",
  },
};

export default function MainPage() {
  return (
    <div className="w-screen min-h-screen pt-[85px] max-w-[920px] mx-auto p-4 flex flex-col justify-center items-center">
      <main className="min-h-screen flex flex-col gap-10 items-center justify-center">
        <section>
          <h1 className="text-[3.2rem] font-display font-[800] text-center m-0 leading-none">
            Tu agenda,
          </h1>
          <span className="block text-[3.2rem] font-display font-[800] text-center text-brand leading-none">
            sin complicaciones
          </span>
        </section>
        <p className="text-center text-gray-700 text-lg max-w-[500px]">
          Conectamos negocios uruguayos con sus clientes. Gestioná turnos,
          empleados y horarios desde un solo lugar.
        </p>
        <section className="flex gap-4">
          <button className="bg-brand cursor-pointer text-white py-3 px-6 rounded-full font-medium hover:bg-[#219e74] hover:scale-105 transition-all">
            Explorar negocios
          </button>
          <button className="bg-white cursor-pointer border border-brand text-brand py-3 px-6 rounded-full font-medium hover:bg-[#d1faf0] hover:scale-105 transition-all">
            Empezar gratis →
          </button>
        </section>
        <div className="w-[80%] mt-4 mx-auto rounded-full shadow-[0_70px_70px_rgba(0,0,0,0.1),_0_1px_10px_rgba(0,0,0,0.05)]">
          <header className="p-4 flex gap-1 items-center bg-brand rounded-t-xl w-full">
            <span className="w-3 h-3 bg-brand-light/50 rounded-full" />
            <span className="w-3 h-3 bg-brand-light/50 rounded-full" />
            <span className="w-3 h-3 bg-brand-light/50 rounded-full" />
            <span className=" ml-4 font-mono w-full text-sm text-white bg-brand-light/50 rounded-lg p-1 text-center">
              reservapp.com/peluqueria-x
            </span>
          </header>
          <div className="w-full bg-white rounded-b-xl grid grid-cols-2 gap-4 p-4">
            {MOCKUP_INFO.map((item, index) => (
              <div
                className="bg-[#f9f7f4] hover:bg-[#dffcf4] cursor-pointer transition-all hover:border-brand border border-[#d3d3d3] rounded-2xl px-4 py-3 flex items-center gap-3"
                key={index}
              >
                <div
                  style={{ backgroundColor: item.color }}
                  className="w-9 h-9 shrink-0 text-xs rounded-full flex items-center justify-center text-white font-bold"
                >
                  {item.icon}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm text-gray-500">{item.hora}</span>
                  <span className="text-[#1f1f1f] text-base font-semibold">
                    {item.nombre}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]" />
                    <span className="text-[#27ae60] text-sm font-medium">
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <section className="mt-20 flex flex-col gap-4 items-center">
        <h2 className="text-brand-light font-medium te tracking-widest uppercase">
          Funcionalidades
        </h2>
        <h1 className="text-black text-[2rem] font-display font-[700] text-center">
          Todo lo que tu negocio necesita
        </h1>
        <main className="grid grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white hover:scale-102 hover:shadow-xl cursor-pointer transition-all  border border-[#d3d3d3] rounded-2xl px-6 py-7 flex flex-col gap-3"
            >
              <div className="text-brand-light rounded-lg bg-[#27d19b28] flex justify-center items-center w-10 h-10  ">
                <span className="w-5 h-5">{feature.icon}</span>
              </div>
              <h3 className="text-black text-lg font-display font-[700]">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          ))}
        </main>
      </section>
      <section className="mt-20 bg-brand w-screen p-20 flex flex-col gap-4 items-center">
        <h2 className="text-[#80fad3] font-medium te tracking-widest uppercase">
          Proceso simple
        </h2>
        <h1 className="text-white text-[2rem] font-display font-[700] text-center">
          En tres pasos estás online
        </h1>
        <p className="text-[#d6d6d6] text-lg text-center">
          Sin conocimientos técnicos, sin complicaciones.
        </p>
        <div className="flex gap-4 max-w-[820px] w-full mx-auto">
          {Object.entries(PASOS).map(([key, paso]) => (
            <div
              key={key}
              className="bg-[#ffffff20] rounded-2xl px-6 py-7 flex flex-col gap-3 items-center text-center w-[300px]"
            >
              <div className="w-10 h-10 rounded-full text-[3rem] font-extrabold font-display text-[#459783] flex items-center justify-center">
                {key}
              </div>
              <h3 className="text-white text-lg font-display font-[700] leading-tight">
                {paso.title}
              </h3>
              <p className="text-[#d6d6d6] text-sm">{paso.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
