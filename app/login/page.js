"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  return (
    <div className="min-h-screen pt-[76px] bg-gray-200 flex items-center justify-center bg-secondary/30">
      <main className="w-full p-10 bg-white max-w-md rounded-lg shadow-lg">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold text-black">Iniciar Sesión</h1>
          <p className="text-sm  text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        <div>
          <form onSubmit={() => {}} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="tu@email.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                placeholder="Ingresa tu contraseña"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition"
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
                className="font-bold cursor pointer text-[#2563EB]"
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
