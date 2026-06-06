import Image from "next/image";

export default function CardNegocio({ negocio }) {
  return (
    <div className="relative bg-white cursor-pointer h-full w-full rounded-xl ">
      <div className="w-full h-32 relative rounded-t-xl ">
        {negocio.banner_url ? (
          <Image
            src={negocio.banner_url}
            alt={negocio.nombre || "Sin nombre"}
            width={400}
            height={200}
            className="w-full h-full object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-xl flex items-center justify-center">
            <p className="text-gray-500">Banner no disponible</p>
          </div>
        )}
        {negocio.image_url ? (
          <Image
            src={negocio.image_url}
            alt={negocio.nombre || "Sin nombre"}
            width={300}
            height={128}
            className=" absolute -bottom-5 left-5 border-2 border-white  rounded-xl w-15 h-15 object-cover "
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Imagen no disponible</p>
          </div>
        )}
      </div>
      <div className="pt-6 pb-4 px-5">
        <p className="font-[700] leading-tight font-display text-gray-800">
          {negocio.nombre || "Sin nombre"}
        </p>
        <p className="text-sm text-gray-600 capitalize">
          {negocio.categoria || "Sin categoría"}
        </p>
        <p className="text-sm text-gray-500">
          {negocio.direccion || "Sin dirección"}
        </p>
      </div>
    </div>
  );
}
