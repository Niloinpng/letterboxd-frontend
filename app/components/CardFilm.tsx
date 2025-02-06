"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importação para navegação
import { FaStar, FaComment } from "react-icons/fa";
import Image from "next/image";

// Definição do tipo de props esperadas no componente
interface CardFilmProps {
  id: number; // Adicionando o ID do filme
  title: string;
  image: string | null;
  rating: number;
  comments: number;
}

export default function CardFilm({ id, title, image, rating, comments }: CardFilmProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter(); // Hook para navegação

  return (
    <div
      className={`relative w-40 h-64 rounded-lg overflow-hidden transition-all duration-150 cursor-pointer ${
        hovered ? "border-4 border-green-500" : "border-none"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/film/${id}`)} // Redireciona ao clicar
    >
      {/* Se a imagem existir, usa <Image>. Caso contrário, mostra um fundo cinza com o título */}
      {image ? (
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-cinzaescuro text-preto font-bold text-sm p-2 text-center">
          {title}
        </div>
      )}

      {/* Overlay com informações ao passar o mouse */}
      {hovered && (
        <div className="absolute inset-0 bg-preto bg-opacity-50 flex flex-col justify-end p-2">
          <div className="flex items-center justify-between text-branco">
            {/* Estrela - Média da nota */}
            <div className="flex items-center gap-1">
              <FaStar className="text-laranja" size={14} />
              <span className="text-xs text-branco">{rating}</span>
            </div>

            {/* Comentários - Quantidade de comentários */}
            <div className="flex items-center gap-1">
              <FaComment className="text-branco" size={14} />
              <span className="text-xs text-branco">{comments}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


