"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mensaje, setMensaje] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || data.session) {
        router.push("/");
      }
    });
  }, [router]);
  function validarForm() {
    const newErrores = {};

    if (!formData.email.trim()) {
      newErrores.errorEmail = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrores.errorEmail = "El correo electrónico no es válido";
    }

    if (!formData.password.trim()) {
      newErrores.errorPassword = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrores.errorPassword =
        "La contraseña debe tener al menos 6 caracteres";
    }

    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje({});

    if (!validarForm()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);
    if (!data?.session) {
      setMensaje({
        errorGeneral: "Error al iniciar sesión. Verifica tus credenciales.",
      });
      return;
    }
    let nomTabla = "";
    let id = "";

    if (data.session?.user?.user_metadata?.rol === "owner") {
      nomTabla = "Duenos";
      id = "idDueño";
    } else if (data.session?.user?.user_metadata?.rol === "user") {
      nomTabla = "Clientes";
      id = "idCliente";
    }

    const { data: dataRol, error: errorRol } = await supabase
      .from(nomTabla)
      .select("nuevo")
      .eq(id, data.session.user.id)
      .single();

    if (error || errorRol) {
      setMensaje({ errorGeneral: "Error al verificar el rol del usuario" });
    } else if (dataRol.nuevo === true) {
      router.push(`/crear-cuenta/${data.session.user.user_metadata.rol}`);
    }

    if (error) {
      setMensaje({ errorGeneral: error.message });
    } else {
      setMensaje({ exito: "¡Sesión iniciada! Bienvenido de nuevo." });
      router.push("/Home");
    }
  }

  return (
    <div className="min-h-screen pt-19 bg-background flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white max-w-md rounded-lg shadow-lg">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold font-display text-black">
            Iniciar Sesión
          </h1>
          <p className="text-sm  text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="tu@email.com"
                onChange={(e) => {
                  setMensaje({ ...mensaje, errorEmail: null });
                  setFormData({ ...formData, email: e.target.value });
                }}
                required
              />
              {mensaje.errorEmail && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorEmail}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                placeholder="Ingresa tu contraseña"
                onChange={(e) => {
                  setMensaje({ ...mensaje, errorPassword: null });
                  setFormData({ ...formData, password: e.target.value });
                }}
                required
              />
              {mensaje.errorPassword && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorPassword}
                </p>
              )}
            </div>
            {mensaje.errorGeneral && (
              <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                {mensaje.errorGeneral}
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-brand text-white py-2 rounded-xl hover:bg-brand/90 transition"
            >
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p
              type="button"
              onClick={() => {}}
              className="text-primary text-black "
            >
              ¿No tienes cuenta?{" "}
              <Link
                href="/signup"
                className="font-bold cursor pointer text-brand"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
