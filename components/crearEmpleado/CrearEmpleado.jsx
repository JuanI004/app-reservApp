"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CrearEmpleado({ idNegocio }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.nombre) {
      alert("Faltan datos");
      return;
    }

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-empleado`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...form,
          idNegocio,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    alert("Empleado creado correctamente");

    setForm({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
    });

    setLoading(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-4 border">
      <h2 className="text-xl font-bold">Crear empleado</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded-lg"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="w-full border p-2 rounded-lg"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Nombre"
        className="w-full border p-2 rounded-lg"
        value={form.nombre}
        onChange={(e) =>
          setForm({ ...form, nombre: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Apellido"
        className="w-full border p-2 rounded-lg"
        value={form.apellido}
        onChange={(e) =>
          setForm({ ...form, apellido: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition"
      >
        {loading ? "Creando..." : "Crear empleado"}
      </button>
    </div>
  );
}