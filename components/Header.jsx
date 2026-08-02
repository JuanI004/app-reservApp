"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCrearNegocioModal } from "./crearNegocio/CrearNegocioModalProvider";
import NotificacionesBell from "./notificaciones/NotificacionesBell";

export default function Header() {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const { abrirCrearNegocio } = useCrearNegocioModal();
  const [role, setRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [negociosEmpleo, setNegociosEmpleo] = useState([]);
  const [displayMenu, setDisplayMenu] = useState(false);

  const headerBtn =
    "inline-flex cursor-pointer items-center justify-center gap-3 h-10  rounded-full text-sm font-medium";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    setSession(null);
  }
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setRole(session?.user?.user_metadata?.rol || null); // ← "rol" sin e
      },
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        setRole(data.session.user?.user_metadata?.rol || null); // ← "rol" sin e
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !role) return;

    const fetchDatosUsuario = async () => {
      const tableName = role === "owner" ? "Duenos" : "Clientes";
      const idName = role === "owner" ? "idDueño" : "idCliente";

      const { data, error } = await supabase
        .from(tableName)
        .select("nombre, apellido, image_url")
        .eq(idName, session.user.id)
        .single();

      if (error) {
        console.error("Error al obtener datos del usuario:", error.message);
      } else {
        setUserInfo(data);
      }
    };

    fetchDatosUsuario();
  }, [session, role]);

  useEffect(() => {
    if (!session || role !== "user") {
      setNegociosEmpleo([]);
      return;
    }

    const fetchNegociosEmpleo = async () => {
      const { data: empleos, error: errorEmpleos } = await supabase
        .from("Empleados")
        .select("idNegocio")
        .eq("idEmpleado", session.user.id)
        .eq("activo", true);

      if (errorEmpleos || !empleos || empleos.length === 0) {
        if (errorEmpleos) {
          console.error("Error trayendo empleos:", errorEmpleos.message);
        }
        setNegociosEmpleo([]);
        return;
      }

      const idsNegocios = empleos.map((e) => e.idNegocio);
      const { data: negocios, error: errorNegocios } = await supabase
        .from("Negocios")
        .select("idNegocio, nombre")
        .in("idNegocio", idsNegocios);

      if (errorNegocios) {
        console.error(
          "Error trayendo negocios donde trabajo:",
          errorNegocios.message,
        );
        setNegociosEmpleo([]);
      } else {
        setNegociosEmpleo(negocios ?? []);
      }
    };

    fetchNegociosEmpleo();
  }, [session, role]);

  const esEmpleado = role === "user" && negociosEmpleo.length > 0;
  const negociosEmpleoTexto =
    negociosEmpleo.length === 1
      ? negociosEmpleo[0].nombre
      : negociosEmpleo.length > 1
        ? `${negociosEmpleo[0].nombre} y ${negociosEmpleo.length - 1} más`
        : "";
  return (
    <header className="fixed w-full max-w-screen bg-brand text-white px-4 py-3 z-20">
      <div className="flex justify-between items-center max-w-[1160px] mx-auto">
        <h1
          className="text-2xl font-display font-[700] cursor-pointer"
          onClick={() => router.push("/")}
        >
          Reserv<span className="text-[#9FE1CB]">App</span>
        </h1>
        <ul className="flex gap-2 items-center">
          {session ? (
            <>
              {role === "owner" && (
                <>
                  <button
                    onClick={abrirCrearNegocio}
                    className={`${headerBtn} px-4 bg-white text-brand hover:bg-background-light`}
                  >
                    + Nuevo negocio
                  </button>
                  <span className="h-8 border-l border-brand-pale/30" />
                </>
              )}
              <NotificacionesBell session={session} />
              <li
                onClick={() => setDisplayMenu(!displayMenu)}
                className={`relative ${headerBtn} px-2 bg-brand-pale/15 hover:bg-brand-pale/30 cursor-pointer transition-all`}
              >
                {userInfo?.image_url ? (
                  <Image
                    src={userInfo.image_url}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8  rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-sm font-medium">
                    {userInfo?.nombre?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                {userInfo?.nombre.split(" ")[0] || "Usuario"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className={`transition-transform ${displayMenu ? "rotate-180" : ""}`}
                >
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
                {displayMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-lg p-4 z-40">
                    <div className="flex items-center gap-3">
                      {userInfo?.image_url ? (
                        <Image
                          src={userInfo.image_url}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-pale/50 flex items-center justify-center text-sm font-medium text-brand">
                          {userInfo?.nombre?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {userInfo?.nombre} {userInfo?.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          {role === "owner"
                            ? "Dueño"
                            : esEmpleado
                              ? `Empleado en ${negociosEmpleoTexto}`
                              : "Cliente"}
                        </div>
                      </div>
                    </div>

                    <div className="my-3 border-t border-gray-100" />

                    <nav className="flex flex-col gap-1">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#000000"
                          viewBox="0 0 256 256"
                        >
                          <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
                        </svg>
                        Mi perfil
                      </Link>

                    </nav>

                    <div className="my-2 border-t border-gray-100" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-2 py-2 rounded-md text-red-500 flex items-center gap-2 hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40A8,8,0,0,0,176,88v32H112a8,8,0,0,0,0,16h64v32a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,229.66,122.34Z"></path>
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li className={`${headerBtn} px-2 hover:bg-brand-light/60`}>
                <Link href="/login">Entrar</Link>
              </li>
              <span className="h-8 border-l border-brand-pale/30" />
              <li
                className={`${headerBtn} bg-brand-pale/15 ml-2 hover:bg-brand-pale/30 px-4 transition-all text-white font-medium hover:bg-[#d1faf0] hover:scale-105`}
              >
                <Link href="/signup">Empezar gratis</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
