"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaUserCircle,
  FaPlus,
  FaPen,
  FaChartBar,
  FaTrash,
} from "react-icons/fa";
import Navbar from "@/app/components/NavBar";
import UserLists from "@/app/components/UserLists";
import UserReviews from "@/app/components/UserReviews";
import { ImageUpload } from "@/app/components/images-handler/ImageUpload";
import { DisplayImage } from "@/app/components/images-handler/DisplayImage";
import AlertModal from "@/app/components/AlertModal";
import StatsModal from "@/app/components/StatsModal";
import { useRouter } from "next/navigation";
import { UserStatistics } from "@/app/types/user-statistics";
import EditProfileModal from "@/app/components/EditProfleModal";

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
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listas" | "avaliacoes">("listas");
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //função para buscar identificar o usuário autenticado
  const fetchLoggedUser = async () => {
    try {
      const res = await fetch("http://localhost:3333/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Não foi possível obter dados do usuário");

      const userData = await res.json();
      setLoggedUserId(userData.id);
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
      setLoggedUserId(null);
    }
  };

  const isOwnProfile = loggedUserId == Number(id);

  //Function to handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3333/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir perfil");
      localStorage.removeItem("token"); //clear the token
      router.push("/"); //redirect to login page
    } catch (error) {
      console.error(error);
    }
  };

  //Function to fetch user statistics
  const fetchUserStats = async () => {
    try {
      const res = await fetch(`http://localhost:3333/users/${id}/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (!res.ok) throw new Error("Erro ao buscar estatísticas");
      const data: UserStatistics = await res.json();
      setUserStats(data);
      setStatsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, []);

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

  if (loading)
    return <p className="text-branco text-center mt-10">Carregando...</p>;
  if (!user)
    return (
      <p className="text-branco text-center mt-10">Usuário não encontrado.</p>
    );

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex justify-center bg-preto text-cinza font-ibm px-16 pt-8">
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-5 w-full">
            <div className="w-24 h-24 relative rounded-full overflow-hidden">
              {isOwnProfile ? (
                <DisplayImage
                  endpoint={`http://localhost:3333/users/${user.id}/profile-picture`}
                  alt={`Foto de perfil de ${user.name}`}
                  className="object-cover"
                  // fallbackImage="/default-avatar.png"
                />
              ) : (
                <div className="w-full h-full bg-cinzaescuro flex items-center justify-center text-branco rounded-full">
                  <FaUserCircle className="w-24 h-24 text-cinza" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <h1 className="text-2xl font-bold text-branco">{user.name}</h1>
                {isOwnProfile ? (
                  <div className="flex gap-2">
                    <button
                      onClick={fetchUserStats}
                      className="h-8 bg-cinzaescuro text-branco flex items-center justify-center gap-2 px-4 text-sm rounded-lg hover:bg-opacity-50 transition"
                    >
                      Estatísticas <FaChartBar className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="h-8 bg-cinzaescuro text-branco flex items-center justify-center gap-2 px-4 text-sm rounded-lg hover:bg-opacity-50 transition"
                    >
                      Editar <FaPen className="w-3 h-3" />
                    </button>
                    <ImageUpload
                      endpoint={`http://localhost:3333/users/${user.id}/profile-picture`}
                      onUploadSuccess={() => window.location.reload()}
                    >
                      <div className="h-8 bg-cinzaescuro text-branco flex items-center justify-center gap-2 px-4 text-sm rounded-lg hover:bg-opacity-50 transition">
                        Foto <FaPen className="w-3 h-3" />
                      </div>
                    </ImageUpload>
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="h-8 bg-red-500 text-branco flex items-center justify-center gap-2 px-4 text-sm rounded-lg hover:bg-opacity-80 transition"
                    >
                      Excluir Perfil <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button className="h-8 bg-cinzaescuro text-branco flex items-center justify-center gap-2 px-4 text-sm rounded-lg hover:bg-opacity-50 transition">
                    Seguir <FaPlus className="w-3 h-3" />
                  </button>
                )}
                {/* The modals */}
                <EditProfileModal
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  user={user}
                />

                <AlertModal
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={handleDeleteProfile}
                  title="Excluir Perfil"
                  message="Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita."
                  confirmText="Quero excluir minha conta"
                  cancelText="Eu me arrependo de minha decisão"
                />

                {userStats && (
                  <StatsModal
                    isOpen={statsModalOpen}
                    onClose={() => setStatsModalOpen(false)}
                    stats={userStats}
                  />
                )}
              </div>
              <p className="text-sm text-cinza">@{user.username}</p>
              <p className="pt-2 text-cinza leading-relaxed">
                {user.bio || "Sem bio disponível"}
              </p>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          <div className="mt-6 w-full border border-cinzaescuro rounded-lg">
            <div className="flex">
              <button
                className={`w-1/2 py-3 text-center transition ${
                  activeTab === "listas"
                    ? "text-branco"
                    : "text-cinza hover:text-azul"
                }`}
                onClick={() => setActiveTab("listas")}
              >
                Listas
              </button>
              <button
                className={`w-1/2 py-3 text-center transition ${
                  activeTab === "avaliacoes"
                    ? "text-branco"
                    : "text-cinza hover:text-azul"
                }`}
                onClick={() => setActiveTab("avaliacoes")}
              >
                Avaliações
              </button>
            </div>
          </div>
          <div className="w-full mt-4">
            {activeTab === "listas" ? (
              <UserLists userId={user.id} />
            ) : (
              <UserReviews userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
