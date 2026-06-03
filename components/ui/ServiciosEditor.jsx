import Input from "./Input";
import Label from "./Label";

export default function ServiciosEditor({ servicios = [], onChange }) {
  function handleFieldChange(index, field, value) {
    const nuevos = [...servicios];
    nuevos[index] = { ...(nuevos[index] || {}), [field]: value };
    onChange(nuevos);
  }

  function handleRemove(index) {
    const nuevos = [...servicios];
    nuevos.splice(index, 1);
    onChange(nuevos);
  }

  function handleAdd() {
    const nuevos = [...servicios, { nombre: "", duracion: "", precio: "" }];
    onChange(nuevos);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {servicios.map((servicio, index) => (
        <div key={index} className="flex gap-4">
          <Input
            type="text"
            placeholder="Nombre del servicio"
            value={servicio?.nombre ?? ""}
            onChange={(e) => handleFieldChange(index, "nombre", e.target.value)}
            className="w-1/2"
          />
          <Input
            type="number"
            min="0"
            placeholder="Duración (min)"
            value={servicio?.duracion ?? ""}
            onChange={(e) =>
              handleFieldChange(index, "duracion", e.target.value)
            }
            className="w-1/4"
          />
          <Input
            type="number"
            min="0"
            placeholder="Precio"
            value={servicio?.precio ?? ""}
            onChange={(e) => handleFieldChange(index, "precio", e.target.value)}
            className="w-1/4 "
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-2 bg-background text-[#E24B4A] border cursor-pointer border-gray-300 rounded-xl hover:border hover:bg-[#E24B4A]/10 hover:border-[#E24B4A] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#E24B4A"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>
      ))}
      <div className="flex w-full">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 text-left w-full cursor-pointer transition-all border border-dashed hover:bg-brand/20 text-brand rounded-xl mt-2"
        >
          + Agregar servicio
        </button>
      </div>
    </div>
  );
}
