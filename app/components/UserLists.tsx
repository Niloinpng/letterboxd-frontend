"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import AddListModal from "./AddListModal";

interface List {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface UserListsProps {
  userId: number;
}

export default function UserLists({ userId }: UserListsProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedList, setExpandedList] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);

  // 🔹 Obtém o ID do usuário logado pelo token
  useEffect(() => {
    async function fetchLoggedUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3333/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao obter usuário logado");

        const user = await res.json();
        console.log("✅ ID do usuário logado:", user.id);
        setLoggedUserId(user.id);
      } catch (error) {
        console.error("Erro ao obter usuário logado:", error);
      }
    }

    fetchLoggedUser();
  }, []);

  // 🔹 Busca as listas do usuário especificado
  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(`http://localhost:3333/lists/user/${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar listas");
        const data: List[] = await res.json();
        setLists(data);
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLists();
  }, [userId]);

  // 🔹 Função para expandir ou recolher a descrição da lista
  const toggleExpand = (listId: number) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  // 🔹 Atualiza as listas quando uma nova for adicionada
  const handleAddList = (newList: List) => {
    setLists((prev) => [...prev, newList]);
  };

  // 🔥 Função para deletar uma lista
  const handleDeleteList = async (listId: number) => {
    try {
      const res = await fetch(`http://localhost:3333/lists/${listId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar lista");

      setLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
    }
  };

  // 🔥 Debug: Verificando valores antes de renderizar
  console.log("🔎 loggedUserId:", loggedUserId, " | userId:", userId);
  console.log("🔎 Comparação:", loggedUserId === userId);

  if (loading) return <p className="text-branco text-center mt-4">Carregando listas...</p>;

  return (
    <div className="bg-cinzaescuro w-full p-4 rounded-lg text-branco">
      <div className="flex justify-between items-center mb-4">
        {/* 🔥 Mostra o botão "Nova Lista" apenas para o próprio usuário */}
        {Number(loggedUserId) === Number(userId) && (
          <button
            className="bg-cinza text-branco flex items-center gap-1 px-3 py-2 text-xs rounded-lg hover:bg-opacity-50 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Nova Lista <FaPlus />
          </button>
        )}
      </div>

      {lists.length === 0 ? (
        <p className="text-cinza">Nenhuma lista encontrada.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id} className="border-b border-cinzaescuro">
              <div className="flex justify-between items-center">
                <button
                  className="w-full text-left py-3 px-2 flex justify-between items-center hover:bg-cinza transition"
                  onClick={() => toggleExpand(list.id)}
                >
                  <span>{list.name}</span>
                  {expandedList === list.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* 🔥 Ícone de lixeira aparece apenas se for o dono da lista */}
                {Number(loggedUserId) === Number(userId) && (
                  <button
                    className="text-branco hover:text-red-500 transition px-2"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {/* Exibição da descrição da lista */}
              {expandedList === list.id && (
                <p className="text-cinza text-sm px-2 pb-3">{list.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 🔥 Modal de Nova Lista */}
      <AddListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddList={handleAddList} />
    </div>
  );
}
