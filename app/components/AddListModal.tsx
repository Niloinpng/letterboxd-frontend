"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList: (newList: { id: number; user_id: number; name: string; description: string }) => void;
}

export default function AddListModal({ isOpen, onClose, onAddList }: AddListModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;

    try {
      const res = await fetch("http://localhost:3333/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, user_id: 1 }), // Simulando user_id
      });

      if (!res.ok) throw new Error("Erro ao criar lista");

      const newList = await res.json();
      onAddList(newList);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-cinzaescuro p-6 rounded-lg w-96 text-branco relative flex flex-col">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-cinza hover:text-branco">
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Criar Nova Lista</h2>

        <input
          type="text"
          className="w-full p-2 bg-preto text-branco border border-cinza rounded-md mb-2"
          placeholder="Nome da lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 bg-preto text-branco border border-cinza rounded-md resize-none mb-4"
          rows={3}
          placeholder="Descrição da lista"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-verde text-branco py-2 rounded-md hover:bg-opacity-80 transition"
          disabled={!name.trim() || !description.trim()}
        >
          Criar
        </button>
      </div>
    </div>
  );
}
