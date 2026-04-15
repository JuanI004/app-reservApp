"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import { supabase } from "../../lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    rol: "",
  });

  function validarForm() {
    const newErrores = {};

    if (!formData.email.trim()) {
      newErrores.errorEmail = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrores.errorEmail = "El correo electrónico no es válido";
    }

    if (!formData.fullName.trim()) {
      newErrores.errorFullName = "El nombre completo es obligatorio";
    }

    if (!formData.rol.trim()) {
      newErrores.errorRol = "El rol es obligatorio";
    }

    if (!formData.phone.trim()) {
      newErrores.errorPhone = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrores.errorPhone = "El teléfono debe tener 9 dígitos";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({});

    if (!validarForm()) {
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          rol: formData.rol,
        },
        emailRedirectTo: "http://localhost:3000/auth/verificacion",
      },
    });

    if (!error && data.user && data.user.identities?.length === 0) {
      setMensaje({ errorGeneral: "Ya existe una cuenta con ese correo." });
      return;
    }
    setLoading(false);

    if (error) {
      setMensaje({ errorGeneral: error.message });
    } else {
      setMensaje({
        success: "¡Cuenta creada! Revisá tu correo para confirmar tu cuenta.",
      });
    }
  };

  return (
    <div className="min-h-screen pt-[76px] bg-gray-200 flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white max-w-md rounded-lg shadow-xl">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold text-black">Registrarse</h1>
          <p className="text-sm  text-gray-400">
            Crea una cuenta para comenzar
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                placeholder="Tu nombre completo"
                onChange={(e) => {
                  setMensaje({ ...mensaje, errorFullName: null });
                  setFormData({ ...formData, fullName: e.target.value });
                }}
              />
              {mensaje.errorFullName && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorFullName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Selecciona tu rol</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`py-2 px-4 rounded-lg border cursor-pointer ${
                    formData.rol === "user"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-white text-black border-gray-300"
                  }`}
                  onClick={() => {
                    setMensaje({ ...mensaje, errorRol: null });
                    setFormData({ ...formData, rol: "user" });
                  }}
                >
                  Usuario
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 rounded-lg border cursor-pointer ${
                    formData.rol === "owner"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-white text-black border-gray-300"
                  }`}
                  onClick={() => {
                    setMensaje({ ...mensaje, errorRol: null });
                    setFormData({ ...formData, rol: "owner" });
                  }}
                >
                  Dueño de negocio
                </button>
              </div>
              {mensaje.errorRol && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorRol}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="099123456"
                value={formData.phone}
                onChange={(e) => {
                  setMensaje({ ...mensaje, errorPhone: null });
                  setFormData({ ...formData, phone: e.target.value });
                }}
              />
              {mensaje.errorPhone && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorPhone}
                </p>
              )}
            </div>
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
              />
              {mensaje.errorPassword && (
                <p className="p-2 bg-[#ef44443f] rounded-lg text-red-600 border border-red-600 text-sm mt-1">
                  {mensaje.errorPassword}
                </p>
              )}
            </div>
            {mensaje.errorGeneral && (
              <p className="text-red-500 text-sm mt-1">
                {mensaje.errorGeneral}
              </p>
            )}
            {mensaje.success && (
              <p className="text-green-500 text-sm mt-1">{mensaje.success}</p>
            )}
            <Button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition"
            >
              Crear cuenta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p
              type="button"
              onClick={() => {}}
              className="text-primary text-black"
            >
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-bold cursor pointer text-[#2563EB]"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
