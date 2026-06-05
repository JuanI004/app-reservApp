import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EscribirResenia({ negocioId, usuarioInfo }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mensaje, setMensaje] = useState("");

  function validarResenia() {
    if (selectedStars === 0) {
      setMensaje("Por favor, selecciona una calificación de estrellas.");
      return false;
    }
    if (reviewText.trim() === "") {
      setMensaje("Por favor, escribe tu reseña.");
      return false;
    }
    if (selectedStars < 1 || selectedStars > 5) {
      setMensaje("La calificación de estrellas debe ser entre 1 y 5.");
      return false;
    }
    return true;
  }

  async function handleSubmitReview() {
    if (!validarResenia()) {
      return;
    }
    const { data, error } = await supabase.from("Reseñas").insert({
      idNegocio: negocioId,
      idCliente: usuarioInfo?.id,
      nombreCliente: usuarioInfo?.user_metadata?.full_name,
      rating: selectedStars,
      comentario: reviewText,
    });

    if (error) {
      console.error("Error al enviar la reseña:", error);
      setMensaje("Error al enviar la reseña. Por favor, intenta nuevamente.");
    } else {
      setSelectedStars(0);
      setReviewText("");
      window.location.reload();
    }
  }

  const visibleStars = hoveredStars || selectedStars;
  return (
    <>
      <p className=" text-gray-500 ">
        Escribe tu reseña después de tu visita al negocio.
      </p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${star <= visibleStars ? "text-brand" : "text-gray-300"} cursor-pointer transition-colors`}
          onMouseEnter={() => setHoveredStars(star)}
          onMouseLeave={() => setHoveredStars(0)}
          onClick={() => setSelectedStars(star)}
        >
          ★
        </span>
      ))}
      <textarea
        className="w-full mt-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
        rows={3}
        placeholder="Escribe tu reseña aquí..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      {mensaje && <p className="mt-2 text-sm text-red-500">{mensaje}</p>}
      <button
        onClick={handleSubmitReview}
        className="mt-2 cursor-pointer bg-brand text-white py-2 px-4 rounded-xl hover:bg-brand-light transition-colors"
      >
        Enviar reseña
      </button>
    </>
  );
}
