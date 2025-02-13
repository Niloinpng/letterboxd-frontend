import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/app/components/AlertModal";

export default function DeleteMediaButton({ mediaId }: { mediaId: number }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const handleDeleteMedia = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/media/${mediaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      router.push("/home");
      if (!response.ok) {
        throw new Error("Falha ao excluir mídia");
      }
    } catch (error) {
      console.error("Erro ao excluir mídia:", error);
    }
  };

  return (
    <>
      <button
        className="bg-red-700 w-44 text-branco text-sm px-6 py-2 rounded-lg hover:bg-opacity-50 transition"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Excluir mídia
      </button>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMedia}
        title="Excluir Perfil"
        message="Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita."
        confirmText="Quero excluir essa mídia."
        cancelText="Eu me arrependo de minha decisão."
      />
    </>
  );
}
