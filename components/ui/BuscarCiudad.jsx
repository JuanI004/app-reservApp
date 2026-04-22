import { useState } from "react";
import ciudades from "../../utils/ciudades";

export default function BuscarCiudad({ value, onConfirm }) {
  const [query, setQuery] = useState(value || "");
  const [show, setShow] = useState(false);

  const filtered = ciudades.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 100)}
        className="w-full px-4 py-2 border bg-background border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="Buscar ciudad..."
      />
      {show && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-auto">
          {filtered.map((c) => (
            <li
              key={c}
              onClick={() => {
                setQuery(c);
                onConfirm(c);
                setShow(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
