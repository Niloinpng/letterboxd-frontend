import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface CommentProps {
  user: { name: string; image: string };
  text: string;
}

export default function Comment({ user, text }: CommentProps) {
  return (
    <div className="flex flex-col gap-2 pt-2 pl-6">
      
      <div className="flex items-center gap-2">
        {user.image ? (
          <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
        ) : (
          <FaUserCircle className="text-cinzaescuro w-8 h-8" />
        )}
        <span className="font-normal text-branco font-ibm">{user.name}</span>
      </div>

      {/* Texto do Comentário */}
      <p className="text-sm font-ibm text-cinza">{text}</p>

      {/* Linha separadora fina */}
      <hr className="w-full border-t-1 border-cinzaescuro" />
    </div>
  );
}
