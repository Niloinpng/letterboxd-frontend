"use client";

import { FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      // Obtém o token do localStorage
      const token = localStorage.getItem("token");

      // Verifica se o token existe
      if (!token) {
        router.push("/");
        return;
      }

      // Faz a requisição para a rota "me" do backend usando fetch
      const response = await fetch("http://localhost:3333/auth/me", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil');
      }

      // Extrai os dados da resposta
      const userData = await response.json();

      // Salva o ID do usuário no state
      setUserId(userData.id);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      // Em caso de erro (token inválido, por exemplo)
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  // Recupera o ID do usuário ao montar o componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    router.push("/"); // Redireciona para a página de login
  };

  // Função para navegar para o perfil do usuário
  const navigateToProfile = () => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-preto p-6 text-white shadow-md px-20">
      <div className="flex flex-row gap-1 align-middle items-center">
        <div className="flex gap-0.5">
          <div className="w-6 h-6 bg-verde rounded-full"></div>
          <div className="w-6 h-6 bg-azul rounded-full"></div>
          <div className="w-6 h-6 bg-laranja rounded-full"></div>
        </div>

        <h1
          className="text-4xl font-ibm font-bold cursor-pointer text-branco"
          onClick={() => router.push("/home")}
        >
          Letterbox
        </h1>
      </div>

      {/* Ícones à direita */}
      <div className="flex items-center gap-4">
        {/* Ícone de usuário */}
        <div 
          className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full cursor-pointer"
          onClick={navigateToProfile}
        >
          <FiUser size={20} />
        </div>

        {/* Botão de logout */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  );
}