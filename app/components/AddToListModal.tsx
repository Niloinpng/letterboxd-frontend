"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface List {
  id: number;
  name: string;
}

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listId: number) => void;
  mediaId: number; // ID do filme a ser adicionado
  userId: number; // ID do usuário logado
}

export default function AddToListModal({ isOpen, onClose, onSubmit, mediaId, userId }: AddToListModalProps) {
  const [selectedList, setSelectedList] = useState<number | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtém as listas do usuário logado
  useEffect(() => {
    async function fetchUserLists() {
      if (!isOpen) return; // Só busca as listas quando o modal abre

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3333/lists/user/${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar listas do usuário");

        const data: List[] = await res.json();
        setLists(data);
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserLists();
  }, [isOpen, userId]);

  // 🔹 Envia o filme para a lista selecionada
  const handleAddToList = async () => {
    if (!selectedList) return;

    try {
      const res = await fetch("http://localhost:3333/list-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: Number(selectedList),
          media_id: Number(mediaId),
          status: "PENDENTE", // 🔥 Sempre começa como PENDENTE
        }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar filme à lista");

      onSubmit(selectedList); // Callback para atualizar a UI
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao adicionar filme à lista:", error);
    }
  };

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

        {/* 🔄 Loading Indicator */}
        {loading ? (
          <p className="text-cinza">Carregando listas...</p>
        ) : (
          <>
            {/* Seleção de Lista */}
            <select
              className="w-full p-2 bg-preto text-branco border border-cinza rounded-md"
              value={selectedList ?? ""}
              onChange={(e) => setSelectedList(Number(e.target.value))}
            >
              <option value="" disabled>Selecione uma lista</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>

            {/* Botão de Adicionar */}
            <button
              onClick={handleAddToList}
              className="w-28 mt-4 bg-verde text-branco py-2 rounded-md hover:bg-opacity-80 transition"
              disabled={selectedList === null}
            >
              Adicionar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
