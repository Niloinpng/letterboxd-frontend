"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserCircle, FaHeart, FaStar, FaComment } from "react-icons/fa";
import Comment from "./Comment";
import CommentFormModal from "./CommentFormModal";

interface ReviewProps {
  user: { name: string; image: string };
  text: string;
  rating: number; // Nota do usuário (de 0 a 5)
  likes: number;
  comments: { id: number; user: { name: string; image: string }; text: string }[];
}

export default function Review({ user, text, rating, likes, comments }: ReviewProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const [isModal, setIsModal] = useState(false); // 🔥 Corrigido nome do estado
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-2 p-4 relative">
      {/* Modal precisa estar aqui fora da estrutura flex */}
      {isModal && (
        <CommentFormModal
          isOpen={isModal}
          onClose={() => setIsModal(false)}
          onSubmit={(comment) => {
            console.log("Comentário enviado:", { comment });
            setIsModal(false);
          }}
        />
      )}

      {/* Nome + Imagem do Usuário + Estrelas */}
      <div className="flex items-center gap-2">
        {user.image ? (
          <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full" />
        ) : (
          <FaUserCircle className="text-cinzaescuro w-10 h-10" />
        )}
        <p className="text-cinza font-sans font-thin">
          Review by <span className="font-normal text-branco font-ibm">{user.name}</span>
        </p>

        {/* Estrelas representando a nota */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: rating }, (_, i) => (
            <FaStar key={i} className="text-verde" size={14} />
          ))}
        </div>
      </div>

      {/* Texto da Review */}
      <p className="text-sm font-ibm text-cinza">{text}</p>

      {/* Botão de Curtida e Comentário */}
      <div className="flex items-center pt-1 flex-row justify-between">
        <div className="flex items-center gap-2 flex-row">
          <button onClick={handleLike} className="focus:outline-none">
            <FaHeart className={`w-5 h-5 ${liked ? "text-red-500" : "text-cinza"}`} />
          </button>
          <p className="text-xs text-cinza font-bold">{likeCount} curtidas</p>
        </div>

        <button className="focus:outline-none" onClick={() => setIsModal(true)}>
          <FaComment className="w-5 h-5 text-cinza" />
        </button>
      </div>

      {/* Linha Separadora Grossa */}
      <hr className="w-full border-t-2 border-cinzaescuro mt-3" />

      {/* Comentários da Review */}
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <Comment key={comment.id} user={comment.user} text={comment.text} />
        ))}
      </div>
    </div>
  );
}
