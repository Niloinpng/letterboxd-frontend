"use client";

import { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
}

export default function ReviewFormModal({ isOpen, onClose, onSubmit }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!isOpen) return null; // Se o modal estiver fechado, não renderiza nada

  return (
    <div className="fixed inset-0 bg-preto bg-opacity-90 flex justify-center items-center z-50">
      {/* Modal */}
      <div className="bg-cinzaescuro p-6 rounded-lg w-96 text-cinza relative flex flex-col items-center justify-center">
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-cinza hover:text-branco">
          <FaTimes />
        </button>

        {/* Seletor de Estrelas */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              className={`cursor-pointer ${star <= rating ? "text-laranja" : "text-cinza"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Campo de Texto */}
        <textarea
          className="w-full p-2 bg-preto text-branco border border-cinza rounded-md resize-none"
          rows={4}
          placeholder="Escreva sua review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        {/* Botão de Envio */}
        <button
          onClick={() => {
            onSubmit(rating, reviewText);
            onClose();
          }}
          className="w-28 mt-4 bg-verde text-branco py-2 rounded-md hover:bg-opacity-80 transition"
          disabled={rating === 0 || reviewText.trim() === ""}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
