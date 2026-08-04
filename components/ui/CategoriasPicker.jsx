import Label from "./Label";
import categorias from "../../utils/categorias";

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
          <option className="font-sans" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
