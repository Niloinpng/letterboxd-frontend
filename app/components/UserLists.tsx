"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface ListItem {
  id: number;
  list_id: number;
  media_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Media {
  id: number;
  title: string;
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
  const [listItems, setListItems] = useState<{ [key: number]: ListItem[] }>({});
  const [mediaData, setMediaData] = useState<{ [key: number]: Media }>({});
  const router = useRouter();

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

  // 🔹 Função para expandir a lista e carregar os itens dentro dela
  const toggleExpand = async (listId: number) => {
    if (expandedList === listId) {
      setExpandedList(null);
      return;
    }

    setExpandedList(listId);

    if (!listItems[listId]) {
      try {
        const res = await fetch(`http://localhost:3333/list-items/list/${listId}`);
        if (!res.ok) throw new Error("Erro ao buscar itens da lista");
        const items: ListItem[] = await res.json();

        const mediaPromises = items.map(async (item) => {
          if (!mediaData[item.media_id]) {
            const mediaRes = await fetch(`http://localhost:3333/media/${item.media_id}`);
            if (!mediaRes.ok) throw new Error("Erro ao buscar mídia");
            const media = await mediaRes.json();
            setMediaData((prev) => ({ ...prev, [media.id]: media }));
          }
        });

        await Promise.all(mediaPromises);
        setListItems((prev) => ({ ...prev, [listId]: items }));
      } catch (error) {
        console.error("Erro ao buscar filmes da lista:", error);
      }
    }
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

  // 🔥 Função para deletar um item da lista
  const handleDeleteItem = async (itemId: number, listId: number) => {
    try {
      const res = await fetch(`http://localhost:3333/list-items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar item");

      setListItems((prev) => ({
        ...prev,
        [listId]: prev[listId].filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error("Erro ao deletar item:", error);
    }
  };

  // 🔥 Função para alterar status do item
  const handleChangeStatus = async (item: ListItem, listId: number) => {
    const nextStatus = {
      PENDENTE: "EM_ANDAMENTO",
      EM_ANDAMENTO: "CONCLUÍDO",
      CONCLUÍDO: "PENDENTE",
    }[item.status];

    try {
      const res = await fetch(`http://localhost:3333/list-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setListItems((prev) => ({
        ...prev,
        [listId]: prev[listId].map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)),
      }));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const statusColors = {
    PENDENTE: "bg-laranja bg-opacity-50",
    EM_ANDAMENTO: "bg-azul bg-opacity-50",
    CONCLUÍDO: "bg-verde bg-opacity-50",
  };

  if (loading) return <p className="text-branco text-center mt-4">Carregando listas...</p>;

  return (
    <div className="bg-cinzaescuro w-full p-4 rounded-lg text-branco">
      <div className="flex justify-between items-center mb-4">
        {Number(loggedUserId) === Number(userId) && (
          <button
            className="bg-cinza text-branco flex items-center gap-1 px-3 py-2 text-xs rounded-lg hover:bg-opacity-50 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Nova Lista <FaPlus />
          </button>
        )}
      </div>

      {lists.map((list) => (
        <div key={list.id} className="border-b border-cinzaescuro">
          <button className="w-full text-left py-3 px-2 flex justify-between items-center hover:bg-cinza transition" onClick={() => toggleExpand(list.id)}>
            <span>{list.name}</span>
            {expandedList === list.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {expandedList === list.id &&
            listItems[list.id]?.map((item) => (
              <div key={item.id} className={`p-2 my-2 rounded-xl px-4 flex justify-between items-center ${statusColors[item.status]}`}>
                <button className="text-branco font-sans font-bold hover:underline" onClick={() => router.push(`/film/${item.media_id}`)}>
                  {mediaData[item.media_id]?.title || "Carregando..."}
                </button>
                {Number(loggedUserId) === Number(userId) && (
                  <div className="flex gap-2">
                    <button onClick={() => handleChangeStatus(item, list.id)}>🔄</button>
                    <button onClick={() => handleDeleteItem(item.id, list.id)}>❌</button>
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}

      <AddListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddList={handleAddList} />
    </div>
  );
}
