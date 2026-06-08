import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import MisTurnosCliente from "./MisTurnosCliente";

export default function PerfilCliente({ session }) {
  const [userInfo, setUserInfo] = useState(null);
  const [misTurnos, setMisTurnos] = useState([]);
  const [personalTurnos, setPersonalTurnos] = useState({});
  const [negociosTurnos, setNegociosTurnos] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("Clientes")
        .select("*")
        .eq("idCliente", session.id)
        .single();

      if (error) {
        console.error("Error fetching user info:", error);
      } else {
        setUserInfo(data);
        console.log("User info:", data);
      }
    };
    const fetchMisTurnos = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("Turnos")
        .select("*")
        .eq("idUsuario", session.id);

      if (error) {
        console.error("Error fetching user appointments:", error);
      } else {
        const turnos = data ?? [];
        setMisTurnos(turnos);

        const idsEmpleados = [
          ...new Set(turnos.map((turno) => turno.idEmpleado).filter(Boolean)),
        ];
        const idsNegocios = [
          ...new Set(turnos.map((turno) => turno.idNegocio).filter(Boolean)),
        ];

        const [resEmpleados, resNegocios] = await Promise.all([
          idsEmpleados.length > 0
            ? supabase
                .from("Empleados")
                .select("idEmpleado, nombre, image_url, rol")
                .in("idEmpleado", idsEmpleados)
            : Promise.resolve({ data: [], error: null }),
          idsNegocios.length > 0
            ? supabase
                .from("Negocios")
                .select("idNegocio, nombre")
                .in("idNegocio", idsNegocios)
            : Promise.resolve({ data: [], error: null }),
        ]);

        const { data: empleados, error: errorEmpleados } = resEmpleados;
        const { data: negocios, error: errorNegocios } = resNegocios;
        const empleadosMapeados = (empleados ?? []).reduce((acc, empleado) => {
          acc[empleado.idEmpleado] = {
            nombre: empleado.nombre || "Desconocido",
            image_url: empleado.image_url,
            rol: empleado.rol || "Desconocido",
          };
          return acc;
        }, {});

        if (errorEmpleados) {
          console.error(
            "Error trayendo empleados de los turnos:",
            errorEmpleados,
          );
        }

        const idsFaltantes = idsEmpleados.filter(
          (idEmpleado) => !empleadosMapeados[idEmpleado],
        );

        let dueniosMapeados = {};
        if (idsFaltantes.length > 0) {
          const { data: duenios, error: errorDuenios } = await supabase
            .from("Duenos")
            .select("idDueño, nombre, apellido, image_url")
            .in("idDueño", idsFaltantes);

          if (errorDuenios) {
            console.error("Error trayendo dueños de los turnos:", errorDuenios);
          } else {
            dueniosMapeados = (duenios ?? []).reduce((acc, duenio) => {
              acc[duenio.idDueño] = {
                nombre:
                  `${duenio.nombre ?? ""} ${duenio.apellido ?? ""}`.trim() ||
                  "Desconocido",
                image_url: duenio.image_url,
                rol: "Dueño",
              };
              return acc;
            }, {});
          }
        }

        setPersonalTurnos({
          ...dueniosMapeados,
          ...empleadosMapeados,
        });

        if (errorNegocios) {
          console.error(
            "Error trayendo negocios de los turnos:",
            errorNegocios,
          );
        } else {
          const negociosMapeados = (negocios ?? []).reduce((acc, negocio) => {
            acc[negocio.idNegocio] = {
              nombre: negocio.nombre || "Negocio desconocido",
            };
            return acc;
          }, {});

          setNegociosTurnos(negociosMapeados);
          console.log("Negocios de los turnos:", negociosMapeados);
        }
        console.log("User appointments:", data);
      }
    };

    fetchUserInfo();
    fetchMisTurnos();
  }, [session]);

  return (
    <div className="min-h-screen bg-background px-5 my-15 w-screen max-w-300 mx-auto">
      <div className="bg-white rounded-xl mt-10 px-6 py-8 flex items-center justify-between ">
        <div className="flex items-center gap-8">
          {userInfo?.image_url ? (
            <Image
              src={userInfo?.image_url}
              alt={userInfo?.nombre}
              className="w-24 h-24 rounded-full border-6 border-white shadow-md object-cover"
              width={96}
              height={96}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
              {userInfo?.nombre ? userInfo.nombre.charAt(0) : "N"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-display font-extrabold text-black">
              {userInfo?.nombre} {userInfo?.apellido}
            </h1>
            <div className="flex items-center text-gray-500 gap-1">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
              </svg>
              <p className="text-sm  mt-1">{session?.email || "Sin email"}</p>
            </div>
            <div className="flex items-center text-gray-500  gap-1">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="mt-1"
              >
                <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
              </svg>
              <p className="text-sm text-gray-500 mt-1">
                {session?.user_metadata?.phone || "Sin teléfono"}
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Cliente desde{" "}
              {userInfo?.created_at
                ? new Date(userInfo.created_at).toLocaleDateString()
                : "Fecha no disponible"}
            </p>
          </div>
        </div>
        <button className="bg-brand text-white hover:bg-brand-dark py-2 px-4 leading-5 cursor-pointer flex items-center gap-2 hover:bg-brand-light rounded-xl transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#FFF"
            viewBox="0 0 256 256"
          >
            <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path>
          </svg>
          Editar perfil
        </button>
      </div>
      <main className="flex flex-col md:flex-row mt-5 gap-5">
        <MisTurnosCliente
          turnos={misTurnos}
          personalTurnos={personalTurnos}
          negociosTurnos={negociosTurnos}
        />
      </main>
    </div>
  );
}
