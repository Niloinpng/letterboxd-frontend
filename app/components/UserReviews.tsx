"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  media_title: string;
  content: string;
  rating: number;
  user_id: number;
}

interface UserReviewsProps {
  userId: number;
}

export default function UserReviews({ userId }: UserReviewsProps) {
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar o usuário autenticado
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

  // Função para buscar todas as reviews
  const fetchUserReviews = async () => {
    try {
      const res = await fetch("http://localhost:3333/review", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar reviews");

      const data = await res.json();
      setReviews(data); // Aqui, estamos diretamente setando todas as reviews
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuário e suas reviews ao montar o componente
  useEffect(() => {
    fetchLoggedUser();
  }, []);

  useEffect(() => {
    if (loggedUserId) {
      fetchUserReviews();
    }
  }, [loggedUserId]);

  return (
    <div className="bg-cinzaescuro p-4 rounded-lg text-branco">
      {loading ? (
        <p>🔄 Carregando avaliações...</p>
      ) : loggedUserId ? (
        <>
          <p className="text-md">⭐ Avaliações do usuário ⭐</p>
          {reviews.length > 0 ? (
            <ul className="mt-2">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-cinza pb-2 mb-2">
                  <p className="text-lg font-bold">{review.media_title}</p>
                  <p className="text-sm">{review.content}</p>
                  <p className="text-yellow-400">⭐ {review.rating}</p>
                  {review.user_id === loggedUserId && (
                    <p className="text-cinza">Essa avaliação é sua!</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-cinza">Nenhuma avaliação encontrada.</p>
          )}
        </>
      ) : (
        <p className="text-cinza">Usuário não autenticado.</p>
      )}
    </div>
  );
}
