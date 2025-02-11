"use client";

import { useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaStar,
  FaPen,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserReviewsFeed } from "@/app/types/user-review-feed";
import { EditReviewModal } from "./EditReviewModal";
import AlertModal from "@/app/components/AlertModal";
import { CreateReviewModal } from "./CreateReviewModal";

interface UserReviewsProps {
  userId: number;
}

export default function UserReviews({ userId }: UserReviewsProps) {
  const [reviews, setReviews] = useState<UserReviewsFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<UserReviewsFeed | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Não autorizado");
          return;
        }

        const response = await fetch(
          `http://localhost:3333/review/user/${userId}/reviews-feed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar avaliações");
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar avaliações"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      const response = await fetch(
        `http://localhost:3333/review/${selectedReview.review_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao excluir avaliação");
      }

      setReviews(
        reviews.filter((r) => r.review_id !== selectedReview.review_id)
      );
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

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

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  if (loading) {
    return (
      <div className="bg-cinzaescuro p-4 rounded-lg">
        <p className="text-branco text-center">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cinzaescuro p-4 rounded-lg">
        <p className="text-vermelho text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-azul text-branco px-4 py-2 rounded-lg hover:bg-opacity-80 transition flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" /> Nova Avaliação
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-cinzaescuro rounded-lg p-6">
          <p className="text-cinza text-center">
            Nenhuma avaliação encontrada. Comece avaliando algo!
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.review_id} className="bg-cinzaescuro rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-branco font-bold">{review.media_title}</h2>
                <p className="text-cinza text-sm">{review.media_type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 text-azul hover:text-branco transition"
                >
                  <FaPen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-vermelho hover:text-branco transition"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>

            <p className="text-branco mb-4 font-ibm">{review.review_content}</p>

            <div className="flex items-center justify-between">
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
              <p className="text-cinza text-sm">
                {formatDate(review.activity_time)}
              </p>
            </div>
          </div>
        ))
      )}

      <CreateReviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userId={userId}
      />

      {selectedReview && (
        <>
          <EditReviewModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedReview(null);
            }}
            review={selectedReview}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedReview(null);
            }}
            onConfirm={handleDeleteReview}
            title="Excluir Avaliação"
            message="Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita."
            confirmText="Sim, excluir"
            cancelText="Cancelar"
          />
        </>
      )}
    </div>
  );
}
