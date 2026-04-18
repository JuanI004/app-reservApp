import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function HomeUser() {
  const [userData, setUserData] = useState(null);
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      console.log("Cargando datos del usuario y negocios...");
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

        const user = authData?.user;
        setUserData(
          user
            ? {
                id: user.id,
                email: user.email,
                nombre:
                  user.user_metadata?.name ||
                  user.user_metadata?.full_name ||
                  "Usuario",
              }
            : null,
        );
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
      <div className="w-full h-full flex items-center justify-center">
        Cargando datos...
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mt-[85px]  p-4 bg-red-500/20 border border-red-500 rounded-lg  w-full h-full flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-screen pt-[105px] h-screen bg-white p-6 space-y-6">
      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Datos del usuario
        </h2>
        {userData ? (
          <ul className="text-gray-700 space-y-1">
            <li>
              <span className="font-medium">Nombre:</span> {userData.nombre}
            </li>
            <li>
              <span className="font-medium">Email:</span> {userData.email}
            </li>
            <li>
              <span className="font-medium">ID:</span> {userData.id}
            </li>
          </ul>
        ) : (
          <p className="text-gray-600">No hay sesión iniciada.</p>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Negocios</h2>
        {negocios.length === 0 ? (
          <p className="text-gray-600">No hay negocios cargados.</p>
        ) : (
          <ul className="space-y-3">
            {negocios.map((negocio) => (
              <li key={negocio.id} className="border rounded-lg p-3">
                <p className="font-medium text-gray-800">
                  {negocio.nombre || "Sin nombre"}
                </p>
                <p className="text-sm text-gray-600">
                  {negocio.rubro || "Sin rubro"}
                </p>
                <p className="text-sm text-gray-500">
                  {negocio.direccion || "Sin dirección"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
