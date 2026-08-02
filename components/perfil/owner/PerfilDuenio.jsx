import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import MisTurnosDuenio from "./MisTurnosDuenio";
import ReseniasRecibidas from "./ReseniasRecibidas";
import Notificaciones from "../../notificaciones/Notificaciones";
import EditarPerfil from "../cliente/EditarPerfil";

export default function PerfilOwner({ session }) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [misNegocios, setMisNegocios] = useState([]);
  const [misTurnos, setMisTurnos] = useState([]);
  const [misReseñas, setMisReseñas] = useState([]);
  const [misNotificaciones, setMisNotificaciones] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);

  async function uploadImageToStorage(file, bucketName, userId) {
    if (!file || !userId) return null;
    const extension = file.name.split(".").pop();
    const fileName = `${userId}.${extension}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
  }

  async function handleSubmit(updatedInfo) {
    if (!session) return;
    try {
      let imageUrl = updatedInfo.image_url || userInfo?.image_url || null;
      if (updatedInfo.image) {
        const uploaded = await uploadImageToStorage(
          updatedInfo.image,
          "perfiles",
          session.id,
        );
        if (uploaded) imageUrl = uploaded;
      }

      const payload = {
        nombre: updatedInfo.nombre,
        apellido: updatedInfo.apellido,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("Duenos")
        .update(payload)
        .eq("idDueño", session.id);

      if (error) {
        console.error("Error actualizando dueño:", error);
        return { error };
      }

      setUserInfo((prev) => ({ ...(prev ?? {}), ...payload }));
      setModalEditar(false);
      return { success: true };
    } catch (err) {
      console.error("handleSubmit error:", err);
      return { error: err };
    }
  }

  async function handleEliminarPerfil() {
    if (!session) return;

    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.",
    );
    if (!confirmacion) return;

    const { error } = await supabase
      .from("Duenos")
      .delete()
      .eq("idDueño", session.id);

    if (error) {
      console.error("Error eliminando perfil:", error);
    } else {
      router.push("/");
    }
  }

  useEffect(() => {
    let activo = true;

    const fetchUserInfo = async () => {
      const { data, error } = await supabase
        .from("Duenos")
        .select("*")
        .eq("idDueño", session?.id)
        .single();
      if (error) {
        console.error("Error fetching user info:", error);
      } else if (activo) {
        setUserInfo(data);
      }
    };

    const fetchTurnos = async () => {
      const { data, error } = await supabase
        .from("Negocios")
        .select("*")
        .eq("idDueño", session?.id);
      if (error) {
        console.error("Error fetching negocios:", error);
        return;
      }

      if (activo) {
        setMisTurnos([]);
        setMisNegocios(data);
      }

      data.forEach(async (negocio) => {
        const { data: turnosNegocio, error } = await supabase
          .from("Turnos")
          .select("*")
          .eq("idNegocio", negocio.idNegocio);

        if (error) {
          console.error("Error fetching turnos:", error);
        } else if (activo) {
          setMisTurnos((prevTurnos) => [
            ...prevTurnos,
            ...turnosNegocio.map((turno) => ({
              ...turno,
              negocioNombre: negocio.nombre,
            })),
          ]);
        }
      });

      const idsNegocios = data.map((negocio) => negocio.idNegocio);
      if (idsNegocios.length === 0) {
        if (activo) setMisReseñas([]);
        return;
      }

      const { data: reseñasData, error: errorReseñas } = await supabase
        .from("Reseñas")
        .select("*")
        .in("idNegocio", idsNegocios);

      if (errorReseñas) {
        console.error("Error fetching reseñas:", errorReseñas);
      } else if (activo) {
        setMisReseñas(reseñasData ?? []);
      }
    };
    const fetchNotificaciones = async () => {
      const { data, error } = await supabase
        .from("Notificaciones")
        .select("*")
        .eq("idUsuario", session?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notificaciones:", error);
      } else if (activo) {
        setMisNotificaciones(data ?? []);
      }
    };

    fetchUserInfo();

    fetchTurnos();

    fetchNotificaciones();

    return () => {
      activo = false;
    };
  }, [session]);

  async function handleMarcarNotificacionLeida(id) {
    setMisNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n)),
    );

    const { error } = await supabase
      .from("Notificaciones")
      .update({ leida: true })
      .eq("id", id);

    if (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  }

  async function handleMarcarTodasNotificacionesLeidas() {
    const idsNoLeidas = misNotificaciones
      .filter((n) => !n.leida)
      .map((n) => n.id);
    if (idsNoLeidas.length === 0) return;

    setMisNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));

    const { error } = await supabase
      .from("Notificaciones")
      .update({ leida: true })
      .in("id", idsNoLeidas);

    if (error) {
      console.error("Error marcando notificaciones como leídas:", error);
    }
  }
  const DATOS = [
    {
      label: "Nombre",
      value: userInfo?.nombre + " " + userInfo?.apellido,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
        </svg>
      ),
    },
    {
      label: "Email",
      value: session?.email || "Sin email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
        </svg>
      ),
    },
    {
      label: "Teléfono",
      value: session?.user_metadata?.phone || "Sin teléfono",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
        </svg>
      ),
    },
    {
      label: "Cliente desde",
      value: userInfo?.created_at
        ? new Date(userInfo.created_at).toLocaleDateString()
        : "Fecha no disponible",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>
        </svg>
      ),
    },
  ];
  return (
    <>
      {modalEditar && (
        <span className="fixed flex items-center justify-center w-screen h-screen bg-black/20">
          {" "}
          <div className="w-full  max-w-md bg-white rounded-xl p-6 shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <EditarPerfil
              userInfo={userInfo}
              session={session}
              onClose={() => setModalEditar(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </span>
      )}
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
                Dueño desde{" "}
                {userInfo?.created_at
                  ? new Date(userInfo.created_at).toLocaleDateString()
                  : "Fecha no disponible"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalEditar(true)}
            className="bg-brand text-white hover:bg-brand-dark py-2 px-4 leading-5 cursor-pointer flex items-center gap-2 hover:bg-brand-light rounded-xl transition-colors"
          >
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
          <section className="md:w-full flex flex-col gap-5">
            <MisTurnosDuenio turnos={misTurnos} />
            <ReseniasRecibidas reseñas={misReseñas} negocios={misNegocios} />
          </section>
          <section className="md:w-2/3 flex flex-col gap-5">
            <div className="bg-white rounded-xl ">
              <h2 className="pt-5 pb-4 px-6  border-b text-lg font-display font-bold border-gray-200  ">
                Datos personales
              </h2>
              {DATOS.map((dato) => (
                <div
                  key={dato.label}
                  className="px-6 py-4 border-b flex items-center gap-3 border-gray-200"
                >
                  <span className="text-gray-500 p-2 bg-background rounded-lg">
                    {dato.icon}
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">{dato.label}</p>
                    <p className="text-sm ">{dato.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl ">
              <div className="flex pt-5 pb-4 px-6 justify-between border-b border-gray-200 items-center ">
                <h2 className="text-lg font-display font-bold ">
                  Mis negocios
                </h2>
                <p className="text-gray-500 text-sm cursor-pointer">
                  {misNegocios.length} guardados
                </p>
              </div>
              {misNegocios.length === 0 ? (
                <div className="px-6 py-10 text-sm text-center text-gray-500">
                  No tienes negocios guardados.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {misNegocios.map((negocio) => (
                    <div
                      key={negocio.idNegocio}
                      onClick={() => router.push(`/negocio/${negocio.idNegocio}`)}
                      className="px-6 hover:bg-background cursor-pointer  py-4 border-b flex items-center gap-3 border-gray-200"
                    >
                      {negocio.image_url ? (
                        <Image
                          src={negocio.image_url}
                          alt={negocio.nombre}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {negocio.nombre.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{negocio.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {negocio.categoria}
                        </p>
                        <p className="text-xs text-gray-400">
                          {negocio.direccion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Notificaciones
              notificaciones={misNotificaciones}
              onMarcarLeida={handleMarcarNotificacionLeida}
              onMarcarTodasLeidas={handleMarcarTodasNotificacionesLeidas}
            />

            <div className="border mb-[105px] border-red-200 bg-red-50 p-4 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-700">Zona de peligro</p>
                  <p className="text-sm text-red-600/80 mt-2">
                    Eliminar tu cuenta borrará todos tus datos, turnos y reseñas
                    de forma permanente.
                  </p>
                </div>
              </div>
              <div className="mt-4 ">
                <button
                  type="button"
                  onClick={handleEliminarPerfil}
                  className="mt-3 px-4 py-2 cursor-pointer inline-flex items-center gap-2 bg-white text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition"
                >
                  Eliminar mi cuenta
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
