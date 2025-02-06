"use client";

import { FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

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
        <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full cursor-pointer">
          <FiUser size={20} />
        </div>

        {/* Botão de logout */}
        <button 
          className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
          onClick={() => router.push("/")}
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
