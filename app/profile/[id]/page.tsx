"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaUserCircle, FaPlus, FaPen } from "react-icons/fa";
import Navbar from "@/app/components/NavBar";
import UserLists from "@/app/components/UserLists";
import UserReviews from "@/app/components/UserReviews";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { id } = useParams(); // Obtém o ID da URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listas" | "avaliacoes">("listas");
  const loggedUserId = 1;

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:3333/users/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  if (loading) return <p className="text-branco text-center mt-10">Carregando...</p>;
  if (!user) return <p className="text-branco text-center mt-10">Usuário não encontrado.</p>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center  bg-preto text-cinza font-ibm px-16 pt-8">
        <div className="flex flex-col w-full">
        <div className="flex flex-row gap-5 w-full">
          
          <div className="w-24 h-24 relative rounded-full overflow-hidden">
            {user.profile_picture ? (
              <Image src={user.profile_picture} alt={user.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-cinzaescuro flex items-center justify-center text-branco rounded-full">
                <FaUserCircle className="w-24 h-24 text-cinza" />
              </div>
            )}
          </div>

          {/* 📄 Informações do Usuário */}
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
                <h1 className="text-2xl font-bold text-branco">{user.name}</h1>
                {user.id === loggedUserId ? (
                    <button className="bg-cinzaescuro text-branco flex items-center gap-2 px-2 text-sm rounded-lg hover:bg-opacity-50 transition">
                    Editar <FaPen /> 
                    </button>
                ) : (
                    <button className="bg-cinzaescuro text-branco flex items-center gap-2 px-2 text-sm rounded-lg hover:bg-opacity-80 transition">
                    Seguir <FaPlus /> 
                    </button>
                )}
            </div>
            <p className="text-sm text-cinza">@{user.username}</p>
            <p className="pt-2 text-cinza leading-relaxed">{user.bio || "Sem bio disponível"}</p>
          </div>
        </div>
        <div className="mt-6 w-full border border-cinzaescuro rounded-lg">
          <div className="flex">
            <button
              className={`w-1/2 py-3 text-center transition ${
                activeTab === "listas" ? "text-branco" : "text-cinza hover:text-azul"
              }`}
              onClick={() => setActiveTab("listas")}
            >
              Listas
            </button>
            <button
              className={`w-1/2 py-3 text-center transition ${
                activeTab === "avaliacoes" ? "text-branco" : "text-cinza hover:text-azul"
              }`}
              onClick={() => setActiveTab("avaliacoes")}
            >
              Avaliações
            </button>
          </div>
        </div>
        <div className="w-full mt-4">
          {activeTab === "listas" ? <UserLists userId={user.id} /> : <UserReviews userId={user.id} />}
        </div>
        </div>
      </div>
    </div>
  );
}
