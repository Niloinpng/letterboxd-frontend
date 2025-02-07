"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CommentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export default function CommentFormModal({ isOpen, onClose, onSubmit }: CommentFormModalProps) {
  const [comment, setComment] = useState("");

  if (!isOpen) return null; // Se o modal estiver fechado, não renderiza nada

  return (
    <div className="fixed inset-0 bg-preto bg-opacity-90 flex justify-center items-center z-50">
      {/* Modal */}
      <div className="bg-cinzaescuro p-6 rounded-lg w-96 text-cinza relative flex flex-col items-center justify-center">
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-cinza hover:text-branco">
          <FaTimes />
        </button>

        {/* Campo de Texto */}
        <textarea
          className="w-full p-2 bg-preto text-branco border border-cinza rounded-md resize-none mt-4 mx-4"
          rows={4}
          placeholder="Escreva seu comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Botão de Envio */}
        <button
          onClick={() => {
            onSubmit(comment);
            onClose();
          }}
          className="w-28 mt-4 bg-verde text-branco py-2 rounded-md hover:bg-opacity-80 transition"
          disabled={comment.trim() === ""}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
