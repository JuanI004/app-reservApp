"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Input from "../../../../components/ui/Input";
import Label from "../../../../components/ui/Label";
import CategoriasPicker from "../../../../components/ui/CategoriasPicker";
import ServiciosEditor from "../../../../components/ui/ServiciosEditor";
import AgregarEmpleado from "../../../../components/agregarEmpleados/AgregarEmpleado";

export default function EditarNegocioPage() {
  const { id } = useParams();
  const [negocio, setNegocio] = useState(null);
  const router = useRouter();
  const [negocioInfo, setNegocioInfo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [hover, SetHover] = useState(null);
  const [camposEditados, setCamposEditados] = useState({});
  const [agregarEmpleado, setAgregarEmpleado] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error obteniendo la sesión:", sessionError);
        return;
      }

      const session = sessionData?.session;
      if (
        !session ||
        !session?.user?.user_metadata?.rol ||
        session?.user?.user_metadata?.rol !== "owner"
      ) {
        router.replace("/login");
        return;
      }

      const userId = session.user.id;

      try {
        const { data: negocioData, error: negocioError } = await supabase
          .from("Negocios")
          .select("*")
          .eq("idDueño", userId)
          .eq("idNegocio", id)
          .single();

        if (negocioError) {
          router.replace("/Home");
          return;
        }

        setNegocio(negocioData);
      } catch (error) {
        console.error("Error en la consulta:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!negocio?.idNegocio) return;
    const fetchEmpleados = async () => {
      const { data, error } = await supabase
        .from("Empleados")
        .select("idEmpleado, nombre, rol, servicios, image_url")
        .eq("idNegocio", negocio?.idNegocio);

      if (error) {
        console.error("Error trayendo empleados:", error.message);
      } else {
        setNegocioInfo((prev) => ({ ...prev, empleados: data }));
        setCargando(false);
      }
    };
    const fetchOwner = async () => {
      if (!negocio?.idDueño) return;

      const { data, error } = await supabase
        .from("Duenos")
        .select("idDueño, nombre, apellido, email, image_url")
        .eq("idDueño", negocio.idDueño)
        .single();

      if (error) {
        console.error("Error trayendo dueño:", error.message);
      } else {
        setNegocioInfo((prev) => ({ ...prev, dueño: data }));
      }
    };
    fetchEmpleados();
    fetchOwner();
  }, [negocio?.idNegocio, negocio?.idDueño]);

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

  function handleFileChange(e, fileType) {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCamposEditados((prev) => ({
      ...prev,
      [fileType === "perfil" ? "image_url" : "banner_url"]: file,
    }));

    setPreview((prev) => {
      const previewIndex = prev.findIndex((item) => item.fileType === fileType);

      if (previewIndex === -1) {
        return [...prev, { objectUrl, fileType }];
      }

      const nextPreview = [...prev];
      nextPreview[previewIndex] = { objectUrl, fileType };
      return nextPreview;
    });
    setMensaje((prev) => ({ ...prev, errorImagen: null }));
  }

  function validarCampos() {
    const newErrores = {};
    const intervaloTurnos =
      camposEditados.intervaloTurnos ?? negocio?.tamTurno;

    if (!camposEditados.nombre && !negocio?.nombre) {
      newErrores.errorNombre = "El nombre del negocio es obligatorio.";
    }
    if (!camposEditados.categoria && !negocio?.categoria) {
      newErrores.errorCategoria = "La categoría del negocio es obligatoria.";
    }
    if (!camposEditados.telefono && !negocio?.telefono) {
      newErrores.errorTelefono = "El teléfono del negocio es obligatorio.";
    }
    if (camposEditados.direccion === "") {
      newErrores.errorDireccion =
        "La dirección del negocio no puede estar vacía.";
    }
    if (camposEditados.ciudad === "") {
      newErrores.errorCiudad = "La ciudad del negocio no puede estar vacía.";
    }

    if (
      intervaloTurnos === undefined ||
      intervaloTurnos === null ||
      isNaN(intervaloTurnos)
    ) {
      newErrores.errorIntervaloTurnos =
        "El intervalo entre turnos es obligatorio.";
    }

    setMensaje(newErrores);
    return Object.keys(newErrores).length === 0;
  }

  function limpiarError(campo) {
    setMensaje((prev) => {
      if (!prev?.[campo]) return prev;
      const nuevosErrores = { ...prev };
      delete nuevosErrores[campo];
      return nuevosErrores;
    });
  }

  async function subirImagenNegocio(file, bucket, prefijo) {
    const extension = file.name.includes(".")
      ? `.${file.name.split(".").pop().toLowerCase()}`
      : "";
    const ruta = `${prefijo}/${negocio.idNegocio}-${Date.now()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(ruta, file, {
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);

    return data.publicUrl;
  }

  async function eliminarNegocio() {
    if (!negocio?.idNegocio) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar tu negocio? Esta acción no se puede deshacer.",
    );
    if (!confirmacion) return;
    setCargando(true);
    const { error } = await supabase
      .from("Negocios")
      .delete()
      .eq("idNegocio", negocio.idNegocio);
    setCargando(false);
    if (error) {
      console.error("Error eliminando negocio:", error.message);
      setMensaje({ errorGeneral: "Hubo un error al eliminar el negocio." });
      return;
    }
    router.replace("/Home");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarCampos()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!negocio?.idNegocio) return;

    const updatedData = {};

    try {
      if (camposEditados.image_url instanceof File) {
        updatedData.image_url = await subirImagenNegocio(
          camposEditados.image_url,
          "negocio",
          "perfil",
        );
      }

      if (camposEditados.banner_url instanceof File) {
        updatedData.banner_url = await subirImagenNegocio(
          camposEditados.banner_url,
          "negocio_banner",
          "banner",
        );
      }
    } catch (uploadError) {
      console.error("Error subiendo imagen:", uploadError);
      setCargando(false);
      setMensaje({
        errorGeneral: "Hubo un error al subir las imágenes del negocio.",
      });
      return;
    }

    if (Object.prototype.hasOwnProperty.call(camposEditados, "nombre")) {
      updatedData.nombre = camposEditados.nombre;
    }
    if (Object.prototype.hasOwnProperty.call(camposEditados, "categoria")) {
      updatedData.categoria = camposEditados.categoria;
    }
    if (Object.prototype.hasOwnProperty.call(camposEditados, "descripcion")) {
      updatedData.descripcion = camposEditados.descripcion;
    }
    if (Object.prototype.hasOwnProperty.call(camposEditados, "telefono")) {
      updatedData.telefono = camposEditados.telefono;
    }
    if (Object.prototype.hasOwnProperty.call(camposEditados, "horarios")) {
      updatedData.horarios = camposEditados.horarios;
    }
    if (
      Object.prototype.hasOwnProperty.call(camposEditados, "intervaloTurnos")
    ) {
      updatedData.tamTurno = camposEditados.intervaloTurnos;
    }
    if (Object.prototype.hasOwnProperty.call(camposEditados, "servicios")) {
      updatedData.servicios = camposEditados.servicios;
    }
    
    if (
      Object.prototype.hasOwnProperty.call(camposEditados, "direccion") ||
      Object.prototype.hasOwnProperty.call(camposEditados, "ciudad")
    ) {
      const [direccionActual = "", ciudadActual = ""] = (
        negocio?.direccion ?? ""
      ).split(",");

      const direccionFinal =
        camposEditados.direccion !== undefined
          ? camposEditados.direccion
          : direccionActual.trim();
      const ciudadFinal =
        camposEditados.ciudad !== undefined
          ? camposEditados.ciudad
          : ciudadActual.trim();

      updatedData.direccion = `${direccionFinal}, ${ciudadFinal}`;
    }

    if (Object.keys(updatedData).length === 0) {
      return;
    }

    setCargando(true);

    const { error } = await supabase
      .from("Negocios")
      .update(updatedData)
      .eq("idNegocio", negocio.idNegocio);

    setCargando(false);

    if (error) {
      console.error("Error actualizando negocio:", error.message);
      setMensaje({ errorGeneral: "Hubo un error al guardar los cambios." });
      return;
    }

    setNegocio((prev) => ({ ...prev, ...updatedData }));
    setMensaje({ exito: "Cambios guardados exitosamente." });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCamposEditados({});
    setPreview([]);
  }

  console.log(negocioInfo);

  const bannerPreview = preview.find((item) => item.fileType === "banner");
  const profilePreview = preview.find((item) => item.fileType === "perfil");

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed  bottom-0 w-screen py-3 border-t border-gray-200 px-4 bg-white z-20 ">
        <div className="max-w-[1160px] flex items-center justify-between w-full  mx-auto">
          <p className="text-gray-500 text-sm">
            Los cambios no guardados se perderán
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-3 cursor-pointer flex gap-2 items-center border border-gray-400 rounded-full hover:bg-gray-100 text-gray-700"
              onClick={() => router.back()}
            >
              Descartar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-3 cursor-pointer flex gap-2 items-center bg-brand rounded-full hover:bg-brand-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden w-screen h-70 bg-white">
        {negocio?.banner_url || bannerPreview?.objectUrl ? (
          <Image
            src={
              bannerPreview?.objectUrl
                ? bannerPreview.objectUrl
                : negocio.banner_url
            }
            alt="Banner del negocio"
            width={800}
            height={300}
            className="w-full h-full object-cover "
          />
        ) : (
          <p className="text-gray-500">Imagen no disponible</p>
        )}
        <div
          onMouseEnter={() => SetHover("banner")}
          onMouseLeave={() => SetHover(null)}
          onClick={() => document.getElementById("bannerImg")?.click()}
          className={`cursor-pointer  absolute inset-0 ${hover === "banner" ? "opacity-100 bg-brand/40" : "opacity-0"} transition-opacity duration-300 flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="#FFF"
            viewBox="0 0 256 256"
          >
            <path d="M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z"></path>
          </svg>
        </div>
      </div>
      <div className="relative max-w-[820px] px-2 w-full mx-auto ">
        {negocio?.image_url || profilePreview?.objectUrl ? (
          <>
            <div
              onMouseEnter={() => SetHover("profile")}
              onMouseLeave={() => SetHover(null)}
              onClick={() => document.getElementById("perfilImg").click()}
              className="absolute -top-30 left-5 w-25 h-25 border-2 border-white rounded-xl overflow-hidden cursor-pointer"
            >
              <Image
                src={
                  profilePreview?.objectUrl
                    ? profilePreview.objectUrl
                    : negocio.image_url
                }
                alt={negocio.nombre || "Sin nombre"}
                width={300}
                height={128}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center bg-brand/40 transition-opacity duration-300 ${hover === "profile" ? "opacity-100" : "opacity-0"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#FFF"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z"></path>
                </svg>
              </div>
            </div>
          </>
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

        {mensaje?.errorGeneral && (
          <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
            {mensaje.errorGeneral}
          </p>
        )}
        {mensaje?.exito && (
          <p className="text-sm mt-1 p-2 rounded-lg border bg-[#10b9813f] text-green-600 border-green-600">
            {mensaje.exito}
          </p>
        )}
        <input
          type="file"
          id="perfilImg"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "perfil")}
        />
        <input
          type="file"
          id="bannerImg"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "banner")}
        />
        <h2 className="text-lg font-display font-[700] mt-6">
          Información básica
        </h2>
        <div className="mt-4 flex flex-col gap-4 bg-white px-6 py-4 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div>
              <Label>Nombre del negocio</Label>
              <Input
                value={camposEditados.nombre ?? negocio?.nombre}
                onChange={(e) => {
                  limpiarError("errorNombre");
                  setCamposEditados((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }));
                }}
                placeholder="Ej: Peluquería Canina"
              />
              {mensaje?.errorNombre && (
                <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                  {mensaje.errorNombre}
                </p>
              )}
            </div>
            <div className="w-full">
              <CategoriasPicker
                categoria={camposEditados.categoria ?? negocio?.categoria}
                setCategoria={(value) => {
                  limpiarError("errorCategoria");
                  if (value === negocio?.categoria) {
                    setCamposEditados((prev) => {
                      const updated = { ...prev };
                      delete updated.categoria;
                      return updated;
                    });
                    return;
                  }
                  setCamposEditados((prev) => ({
                    ...prev,
                    categoria: value,
                  }));
                }}
              />
              {mensaje?.errorCategoria && (
                <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                  {mensaje.errorCategoria}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Descripción</Label>
            <textarea
              id="descripcion"
              placeholder="Cuéntanos un poco sobre tu negocio"
              className="w-full border bg-background border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              value={camposEditados.descripcion ?? negocio?.descripcion}
              onChange={(e) => {
                if (e.target.value === negocio?.descripcion) {
                  setCamposEditados((prev) => {
                    const updated = { ...prev };
                    delete updated.descripcion;
                    return updated;
                  });
                  return;
                }
                setCamposEditados((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }));
              }}
            />
          </div>
        </div>
        <h2 className="text-lg font-display font-[700] mt-6">
          Ubicación & contacto
        </h2>
        <div className="mt-4 flex flex-col gap-4 bg-white px-6 py-4 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div>
              <Label>Dirección</Label>
              <Input
                value={
                  camposEditados.direccion ?? negocio?.direccion.split(",")[0]
                }
                onChange={(e) => {
                  limpiarError("errorDireccion");
                  if (e.target.value === negocio?.direccion.split(",")[0]) {
                    setCamposEditados((prev) => {
                      const updated = { ...prev };
                      delete updated.direccion;
                      return updated;
                    });
                    return;
                  }
                  setCamposEditados((prev) => ({
                    ...prev,
                    direccion: e.target.value,
                  }));
                }}
              />
              {mensaje?.errorDireccion && (
                <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                  {mensaje.errorDireccion}
                </p>
              )}
            </div>
            <div>
              <Label>Ciudad / Barrio</Label>
              <Input
                value={
                  camposEditados.ciudad ?? negocio?.direccion.split(",")[1]
                }
                onChange={(e) => {
                  limpiarError("errorCiudad");
                  if (e.target.value === negocio?.direccion.split(",")[1]) {
                    setCamposEditados((prev) => {
                      const updated = { ...prev };
                      delete updated.ciudad;
                      return updated;
                    });
                    return;
                  }
                  setCamposEditados((prev) => ({
                    ...prev,
                    ciudad: e.target.value,
                  }));
                }}
              />
              {mensaje?.errorCiudad && (
                <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                  {mensaje.errorCiudad}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Telefono</Label>
            <Input
              value={camposEditados.telefono ?? negocio?.telefono ?? ""}
              onChange={(e) => {
                limpiarError("errorTelefono");
                if (e.target.value === negocio?.telefono) {
                  setCamposEditados((prev) => {
                    const updated = { ...prev };
                    delete updated.telefono;
                    return updated;
                  });
                  return;
                }
                setCamposEditados((prev) => ({
                  ...prev,
                  telefono: e.target.value,
                }));
              }}
            />
            {mensaje?.errorTelefono && (
              <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                {mensaje.errorTelefono}
              </p>
            )}
          </div>
        </div>
        <h2 className="text-lg font-display font-[700] mt-6">
          Horarios de atención
        </h2>
        <div className="mt-4 flex flex-col gap-2  bg-white p-6 rounded-xl">
          {[...Array(7)].map((_, index) => {
            const horariosSource =
              camposEditados?.horarios ?? negocio?.horarios ?? [];
            const horarioDia = horariosSource.find((h) => h?.dia === index + 1);

            return (
              <div
                key={index}
                className={`px-3 py-2 flex items-center gap-4  ${!horarioDia?.activa ? "opacity-50" : "bg-brand-light/10 border border-brand/40 rounded-xl"}`}
              >
                <input
                  type="checkbox"
                  checked={horarioDia?.activa || false}
                  onChange={() => {
                    const nuevaActivo = !horarioDia?.activa;
                    setCamposEditados((prev) => {
                      const horarios = prev.horarios || negocio?.horarios || [];
                      const horarioIndex = horarios.findIndex(
                        (h) => h.dia === index + 1,
                      );
                      if (horarioIndex !== -1) {
                        const updatedHorarios = [...horarios];
                        updatedHorarios[horarioIndex] = {
                          ...updatedHorarios[horarioIndex],
                          activa: nuevaActivo,
                        };
                        return { ...prev, horarios: updatedHorarios };
                      } else {
                        return {
                          ...prev,
                          horarios: [
                            ...(horarios || []),
                            {
                              dia: index + 1,
                              activa: nuevaActivo,
                              desde: "09:00",
                              hasta: "18:00",
                            },
                          ],
                        };
                      }
                    });
                  }}
                  id={`dia-${index}`}
                  className="w-4 h-4 accent-brand bg-gray-100 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand transition"
                />
                <label
                  htmlFor={`dia-${index}`}
                  className="text-gray-700 text-sm"
                >
                  {
                    [
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                      "Domingo",
                    ][index]
                  }
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="time"
                    value={horarioDia?.desde || "09:00"}
                    onChange={(e) => {
                      const nuevoDesde = e.target.value;
                      setCamposEditados((prev) => {
                        const horarios =
                          prev.horarios || negocio?.horarios || [];
                        const horarioIndex = horarios.findIndex(
                          (h) => h.dia === index + 1,
                        );
                        if (horarioIndex !== -1) {
                          const updatedHorarios = [...horarios];
                          updatedHorarios[horarioIndex] = {
                            ...updatedHorarios[horarioIndex],
                            desde: nuevoDesde,
                          };
                          return { ...prev, horarios: updatedHorarios };
                        } else {
                          return {
                            ...prev,
                            horarios: [
                              ...(horarios || []),
                              {
                                dia: index + 1,
                                activa: true,
                                desde: nuevoDesde,
                                hasta: "18:00",
                              },
                            ],
                          };
                        }
                      });
                    }}
                    className="w-30 text-center py-1 text-sm border bg-background border-brand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">a</span>
                  <input
                    type="time"
                    value={horarioDia?.hasta || "18:00"}
                    onChange={(e) => {
                      const nuevoHasta = e.target.value;
                      setCamposEditados((prev) => {
                        const horarios =
                          prev.horarios || negocio?.horarios || [];
                        const horarioIndex = horarios.findIndex(
                          (h) => h.dia === index + 1,
                        );
                        if (horarioIndex !== -1) {
                          const updatedHorarios = [...horarios];
                          updatedHorarios[horarioIndex] = {
                            ...updatedHorarios[horarioIndex],
                            hasta: nuevoHasta,
                          };
                          return { ...prev, horarios: updatedHorarios };
                        } else {
                          return {
                            ...prev,
                            horarios: [
                              ...(horarios || []),
                              {
                                dia: index + 1,
                                activa: true,
                                desde: "09:00",
                                hasta: nuevoHasta,
                              },
                            ],
                          };
                        }
                      });
                    }}
                    className="w-30 text-center py-1 text-sm  border bg-background border-brand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
          <div className="flex w-full items-end flex-col gap-1">
            <Label>Intervalo entre turnos</Label>
            <Input
              type="number"
              value={camposEditados.intervaloTurnos ?? negocio?.tamTurno}
              onChange={(e) =>
                setCamposEditados((prev) => ({
                  ...prev,
                  intervaloTurnos: parseInt(e.target.value, 10),
                }))
              }
              className="w-40"
              placeholder="Ej: 30 (minutos)"
            />
            {mensaje?.errorIntervaloTurnos && (
              <p className="text-sm mt-1 p-2 rounded-lg border bg-[#ef44443f] text-red-600 border-red-600">
                {mensaje.errorIntervaloTurnos}
              </p>
            )}
          </div>
        </div>
        <h2 className="text-lg font-display font-[700] mt-6">Servicios</h2>
        <div className="mt-4 flex flex-col gap-2  bg-white p-6 rounded-xl">
          {negocio?.servicios && negocio.servicios.length > 0 ? (
            <ServiciosEditor
              servicios={camposEditados?.servicios ?? negocio?.servicios ?? []}
              onChange={(nuevos) =>
                setCamposEditados((prev) => ({ ...prev, servicios: nuevos }))
              }
            />
          ) : (
            <p className="text-gray-500 px-6">No hay servicios registrados</p>
          )}
        </div>
        <h2 className="text-lg font-display font-[700] mt-6">Equipo</h2>
        <div className="mt-4 flex flex-col gap-4 pt-4 bg-white  rounded-xl">
          {negocioInfo?.empleados && negocioInfo?.empleados?.length > 0 ? (
            <div className="px-6">
              {negocioInfo?.empleados?.map((emp) => (
                <div
                  key={emp.idEmpleado}
                  className="flex items-center  justify-between rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={emp.image_url || "/default-profile.png"}
                      alt={emp.nombre}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-display font-[600]">{emp.nombre}</p>
                      <p className="text-sm text-gray-600">{emp.rol}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNegocioInfo((prev) => ({
                        ...prev,
                        empleados: prev.empleados.filter(
                          (e) => e.idEmpleado !== emp.idEmpleado,
                        ),
                      }))
                    }
                    className="p-2  hover:text-[#E24B4A] border cursor-pointer border-gray-300 rounded-xl hover:border hover:bg-[#E24B4A]/10 hover:border-[#E24B4A] transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 px-6">No hay empleados registrados</p>
          )}

          <div
            onClick={() => setAgregarEmpleado(true)}
            className="border-t cursor-pointer justify-between border-dashed  text-brand px-6 py-3  hover:bg-brand/10 border-brand flex   w-full"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
              </svg>
              <p>Agregar empleado por email</p>
            </div>
            {agregarEmpleado && (
              <button
                type="button"
                className="text-brand h-[35px] px-2 cursor-pointer hover:text-brand-light transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setAgregarEmpleado(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            )}
          </div>
          {agregarEmpleado && (
            <AgregarEmpleado handleClose={() => setAgregarEmpleado(false)} />
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-display font-[700] mb-2">
            Zona de peligro
          </h2>
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
                <p className="font-medium text-red-700">
                  Acciones irreversibles
                </p>
                <p className="text-sm text-red-600/80 mt-2">
                  Eliminar el negocio borrará permanentemente todos sus datos:
                  turnos, empleados y servicios asociados. Esta acción no se
                  puede deshacer.
                </p>
              </div>
            </div>
            <div className="mt-4 ">
              <button
                type="button"
                onClick={eliminarNegocio}
                className="mt-3 px-4 py-2 cursor-pointer inline-flex items-center gap-2 bg-white text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition"
              >
                Eliminar este negocio
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
