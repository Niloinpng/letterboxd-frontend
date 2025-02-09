"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { lists } from "@/app/data/lists";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listId: number) => void;
}

export default function AddToListModal({ isOpen, onClose, onSubmit }: AddToListModalProps) {
  const [selectedList, setSelectedList] = useState<number | null>(null);

  if (!isOpen) return null; // Se o modal estiver fechado, não renderiza nada

  return (
    <div className="fixed inset-0 bg-preto bg-opacity-90 flex justify-center items-center z-50">
      {/* Modal */}
      <div className="bg-cinzaescuro p-6 rounded-lg w-96 text-cinza relative flex flex-col items-center">
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-cinza hover:text-branco">
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-branco mb-4">Adicionar à Lista</h2>

        {/* Seleção de Lista */}
        <select
          className="w-full p-2 bg-preto text-branco border border-cinza rounded-md"
          value={selectedList ?? ""}
          onChange={(e) => setSelectedList(Number(e.target.value))}
        >
          <option value="" disabled>Selecione uma lista</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.title}
            </option>
          ))}
        </select>

        {/* Botão de Adicionar */}
        <button
          onClick={() => {
            if (selectedList !== null) {
              onSubmit(selectedList);
              onClose();
            }
          }}
          className="w-28 mt-4 bg-verde text-branco py-2 rounded-md hover:bg-opacity-80 transition"
          disabled={selectedList === null}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
