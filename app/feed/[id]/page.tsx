"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/NavBar";
import { FaHeart, FaComment, FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserFeed } from "@/app/types/user-feed";

export default function FeedPage() {
  const params = useParams();
  const router = useRouter();
  const [feed, setFeed] = useState<UserFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(
          `http://localhost:3333/review/user/${params.id}/feed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar o feed");
        }

        const data = await response.json();
        setFeed(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar o feed"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [params.id]);

  // Função para renderizar as estrelas baseadas na avaliação
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-amarelo" : "text-cinzaescuro"
        }`}
      />
    ));
  };

  // Função para formatar a data em "há X tempo"
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-preto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-branco text-center">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-preto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-vermelho text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-preto">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-branco font-ibm mb-8">
          Seu Feed
        </h1>

        <div className="space-y-6">
          {feed.length === 0 ? (
            <div className="bg-cinzaescuro rounded-lg p-6">
              <p className="text-cinza text-center font-ibm">
                Nenhuma avaliação encontrada. Siga outros usuários para ver suas
                avaliações aqui!
              </p>
            </div>
          ) : (
            feed.map((review) => (
              <div
                key={review.review_id}
                className="bg-cinzaescuro rounded-lg p-6 transition hover:bg-opacity-75 cursor-pointer"
                onClick={() => router.push(`/review/${review.review_id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-azul font-ibm font-medium">
                      @{review.author}
                    </p>
                    <h2 className="text-branco font-bold mt-1">
                      {review.media_title}
                    </h2>
                    <p className="text-cinza text-sm">{review.media_type}</p>
                  </div>
                  <p className="text-cinza text-sm">
                    {formatDate(review.activity_time)}
                  </p>
                </div>

                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>

                <p className="text-branco mb-4 line-clamp-3 font-ibm">
                  {review.review_content}
                </p>

                <div className="flex gap-4 text-cinza text-sm">
                  <div className="flex items-center gap-1">
                    <FaHeart className="w-4 h-4" />
                    <span>{review.like_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment className="w-4 h-4" />
                    <span>{review.comment_count}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
