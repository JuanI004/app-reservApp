export default function Paginacion({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-gray-200">
      <button
        type="button"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
        className="w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-500 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        ‹
      </button>
      {paginas.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onCambiar(n)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${
            n === pagina
              ? "bg-brand text-white"
              : "text-gray-600 hover:bg-background"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
        aria-label="Página siguiente"
        className="w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-500 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        ›
      </button>
    </div>
  );
}
