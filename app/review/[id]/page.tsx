"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/NavBar";
import { FaHeart, FaComment, FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserReview } from "@/app/types/user-review";
import { UserFeed } from "@/app/types/user-feed";
import CommentFormModal from "@/app/components/CommentFormModal";
import CommentList from "@/app/components/commentList";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // Controle do modal

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(
          `http://localhost:3333/review/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar a review");
        }

        const data = await response.json();
        setReview(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar a review",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [params.id]);

  const handleSubmitComment = async (comment: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !review) {
        router.push("/");
        return;
      }

      const response = await fetch("http://localhost:3333/comment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: review.user_id, // Associa o comentário ao usuário da review
          review_id: review.id, // Associa o comentário à review
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar o comentário");
      }

      console.log("Comentário enviado com sucesso!");
      window.location.reload();

      // Opcional: Atualizar a review para refletir o novo comentário
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
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

  if (error || !review) {
    return (
      <div className="min-h-screen bg-preto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-vermelho text-center">
            {error || "Review não encontrada"}
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-preto">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-cinzaescuro rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-azul font-ibm font-medium">@ID{review.id}</p>
              <h2 className="text-branco font-bold mt-1">
                {review.media_title}
              </h2>
              <p className="text-cinza text-sm">{review.media_type}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>

          <p className="text-branco mb-4 font-ibm">{review.content}</p>

          <div className="flex gap-4 text-cinza text-sm">
            <div className="flex items-center gap-1">
              <FaHeart className="w-4 h-4" />
              <span>{review.like_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComment
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsCommentModalOpen(true)}
              />
              <span>{review.comment_count}</span>
            </div>
          </div>
          <div>
            <CommentList />
          </div>
        </div>
      </div>

      {/* Modal de comentário */}
      <CommentFormModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSubmit={handleSubmitComment}
      />
    </div>
  );
}
