"use client";

interface UserReviewsProps {
  userId: number;
}

export default function UserReviews({ userId }: UserReviewsProps) {
  return (
    <div className="bg-cinzaescuro p-4 rounded-lg text-branco">
      <p className="text-md">⭐ Exibindo avaliações do usuário ID {userId}</p>
    </div>
  );
}
