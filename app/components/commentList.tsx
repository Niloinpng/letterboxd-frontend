import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaComment } from "react-icons/fa";

interface Comment {
  id: number;
  user_name: string; // Nome do usuário que fez o comentário
  content: string;
  created_at: string;
}

export default function CommentList() {
  const params = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(`http://localhost:3333/comment`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar os comentários");
        }

        const data = await response.json();

        // Filtra os comentários pelo review_id no frontend (caso necessário)
        const filteredComments = data.filter(
          (comment: Comment) => comment.review_id === Number(params.id),
        );

        setComments(filteredComments);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar os comentários",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [params.id]);

  if (loading) return <p className="text-branco">Carregando comentários...</p>;

  if (error) return <p className="text-vermelho">{error}</p>;

  return (
    <div className="bg-cinzaescuro p-4 rounded-lg mt-6">
      <h3 className="text-branco font-bold mb-2 flex items-center gap-2">
        <FaComment /> Comentários
      </h3>
      {comments.length === 0 ? (
        <p className="text-cinza">Nenhum comentário ainda. Seja o primeiro!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b border-cinza pb-2">
              <p className="text-azul font-semibold">@{comment.user_name}</p>
              <p className="text-branco">{comment.content}</p>
              <p className="text-cinza text-xs">
                {new Date(comment.created_at).toLocaleDateString("pt-BR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
