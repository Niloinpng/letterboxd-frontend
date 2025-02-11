"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList: (newList: { id: number; user_id: number; name: string; description: string }) => void;
}

export default function AddListModal({ isOpen, onClose, onAddList }: AddListModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  // 🔹 Obtém o ID do usuário logado ao abrir o modal
  useEffect(() => {
    async function fetchUserId() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Erro: Token não encontrado.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3333/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar ID do usuário");

        const user = await res.json();
        setUserId(Number(user.id)); // 🔥 Converte para número inteiro
      } catch (error) {
        console.error("Erro ao obter ID do usuário:", error);
      }
    }

    if (isOpen) fetchUserId();
  }, [isOpen]);

  if (!isOpen) return null;

  // 🔹 Enviar requisição para criar a nova lista
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || userId === null) {
      console.error("Erro: Campos vazios ou usuário não autenticado.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3333/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId, // ✅ Garante que o user_id seja inteiro
          name,
          description,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar lista");

      const newList = await res.json();
      onAddList(newList);
      onClose();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
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
