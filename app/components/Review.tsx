"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import Comment from "./Comment";

interface ReviewProps {
  user: { name: string; image: string };
  text: string;
  likes: number;
  comments: { id: number; user: { name: string; image: string }; text: string }[];
}

export default function Review({ user, text, likes, comments }: ReviewProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      
      <div className="flex items-center gap-2">
        {user.image ? (
          <Image src={user.image} alt={user.name} width={10} height={10} className="rounded-full" />
        ) : (
          <FaUserCircle className="text-cinzaescuro w-10 h-10" />
        )}
        <p className=" text-cinza font-sans font-thin">
            Review by <span className="font-normal text-branco font-ibm">{user.name}</span>
        </p>
      </div>

      <p className="text-sm font-ibm text-cinza">{text}</p>

      
      <div className="flex items-center gap-2 pt-1">
        <button onClick={handleLike} className="focus:outline-none">
          <FaHeart className={`w-5 h-5 ${liked ? "text-red-500" : "text-cinza"}`} />
        </button>
        <p className="text-xs text-cinza font-bold">{likeCount} curtidas</p>
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
