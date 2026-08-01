export default function BotonFavorito({ esFavorito, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`cursor-pointer transition-colors ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 256 256"
        fill={esFavorito ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="16"
      >
        <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z"></path>
      </svg>
    </button>
  );
}
