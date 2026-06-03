import Label from "./Label";

const categorias = [
  { value: "peluquería", label: "Peluquería" },
  { value: "restaurante", label: "Restaurante" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "salon de eventos", label: "Salón de eventos" },
  { value: "tatuajes", label: "Tatuajes & Piercings" },
  { value: "spa", label: "Spa" },
  { value: "clinica", label: "Clínica" },
];

export default function CategoriasPicker({ categoria, setCategoria, error }) {
  return (
    <>
      <Label htmlFor="categoria">Categoría *</Label>
      <select
        id="categoria"
        className="w-full border bg-background border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        value={categoria || ""}
        onChange={(e) => setCategoria(e.target.value)}
      >
        <option className="font-sans" value="">
          Selecciona una categoría
        </option>
        {categorias.map((opt) => (
          <option className="font-sans" key={opt.value} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
