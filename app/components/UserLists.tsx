"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(`http://localhost:3333/lists/user/${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar listas");
        const data: List[] = await res.json();
        setLists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLists();
  }, [userId]);

  const toggleExpand = (listId: number) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  const handleAddList = (newList: List) => {
    setLists((prev) => [...prev, newList]);
  };

  if (loading) return <p className="text-branco text-center mt-4">Carregando listas...</p>;

  return (
    <div className="bg-cinzaescuro w-full p-4 rounded-lg text-branco">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-cinza text-branco flex items-center gap-1 px-3 py-2 text-xs rounded-lg hover:bg-opacity-50 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Nova Lista <FaPlus /> 
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="text-cinza">Nenhuma lista encontrada.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id} className="border-b border-cinzaescuro">
              <button
                className="w-full text-left py-3 px-2 flex justify-between items-center hover:bg-cinzaescuro transition"
                onClick={() => toggleExpand(list.id)}
              >
                <span>{list.name}</span>
                {expandedList === list.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedList === list.id && (
                <p className="text-cinza text-sm px-2 pb-3">{list.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Nova Lista */}
      <AddListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddList={handleAddList} />
    </div>
  );
}
