import { useState, useEffect } from "react";
import {
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaPencilAlt,
  FaTimes,
} from "react-icons/fa";
import AddListModal from "./AddListModal";
import EditListModal from "./EditListModal";
import AddMediaModal from "./AddMediaToList";

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
  media: MediaItem;
}

interface UserListsProps {
  userId: number;
}

interface MediaItem {
  id: number;
  title: string;
  type: string;
}

export default function UserLists({ userId }: UserListsProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [listItems, setListItems] = useState<{ [key: number]: ListItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [expandedList, setExpandedList] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);

  // Fetch logged user
  useEffect(() => {
    async function fetchLoggedUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3333/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch lists
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

  // Fetch list items when a list is expanded
  // useEffect(() => {
  //   async function fetchListItems(listId: number) {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:3333/list-items/list/${listId}`
  //       );
  //       if (!res.ok) throw new Error("Erro ao buscar itens da lista");
  //       const data: ListItem[] = await res.json();
  //       setListItems((prev) => ({ ...prev, [listId]: data }));
  //     } catch (error) {
  //       console.error("Erro ao buscar itens da lista:", error);
  //     }
  //   }

  //   if (expandedList) {
  //     fetchListItems(expandedList);
  //   }
  // }, [expandedList]);

  const toggleExpand = (listId: number) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  const handleAddList = (newList: {
    id: number;
    user_id: number;
    name: string;
    description: string;
  }) => {
    setLists((prev) => [
      ...prev,
      {
        ...newList,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  };

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

  const refreshListItems = async (listId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3333/list-items/list/${listId}`
      );
      if (!res.ok) throw new Error("Erro ao buscar itens da lista");
      const data: ListItem[] = await res.json();
      setListItems((prev) => ({ ...prev, [listId]: data }));
    } catch (error) {
      console.error("Erro ao buscar itens da lista:", error);
    }
  };

  const handleAddMedia = (newMedia: MediaItem) => {
    if (selectedList) {
      const newListItem: ListItem = {
        id: Date.now(),
        list_id: selectedList.id,
        media_id: newMedia.id,
        media: newMedia,
      };

      setListItems((prev) => ({
        ...prev,
        [selectedList.id]: [...(prev[selectedList.id] || []), newListItem],
      }));
    }
  };

  if (loading)
    return <p className="text-branco text-center mt-4">Carregando listas...</p>;

  return (
    <div className="bg-cinzaescuro w-full p-4 rounded-lg text-branco">
      <div className="flex justify-between items-center mb-4">
        {Number(loggedUserId) === Number(userId) && (
          <button
            className="bg-cinza text-branco flex items-center gap-1 px-3 py-2 text-xs rounded-lg hover:bg-opacity-50 transition"
            onClick={() => setIsAddModalOpen(true)}
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
                  {expandedList === list.id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>

                {Number(loggedUserId) === Number(userId) && (
                  <div className="flex gap-2 px-2">
                    <button
                      className="text-branco hover:text-verde transition"
                      onClick={() => {
                        setSelectedList(list);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="text-branco hover:text-red-500 transition"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              {expandedList === list.id && (
                <div className="px-2 pb-3">
                  <p className="text-cinza text-sm mb-3">{list.description}</p>

                  {Number(loggedUserId) === Number(userId) && (
                    <button
                      className="bg-verde text-branco text-xs px-3 py-1 rounded-md hover:bg-opacity-80 transition mb-3 flex items-center gap-1"
                      onClick={() => {
                        setSelectedList(list);
                        setIsAddMediaModalOpen(true);
                      }}
                    >
                      Adicionar Mídia <FaPlus />
                    </button>
                  )}

                  {/* <div className="space-y-2">
                    {listItems[list.id]?.map((item) => (
                      <div
                        key={item.media.title}
                        className="flex justify-between items-center bg-verde p-2 rounded-md"
                      >
                        <span className="text-sm">{item.media.title}</span>
                      </div>
                    ))}
                  </div> */}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <AddListModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddList={handleAddList}
      />

      <EditListModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedList(null);
        }}
        list={selectedList}
      />

      <AddMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => {
          setIsAddMediaModalOpen(false);
          setSelectedList(null);
        }}
        listId={selectedList?.id || 0}
        onAddMedia={handleAddMedia}
      />
    </div>
  );
}
