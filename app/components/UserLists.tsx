"use client";

interface UserListsProps {
  userId: number;
}

export default function UserLists({ userId }: UserListsProps) {
  return (
    <div className="bg-cinzaescuro p-4 rounded-lg text-branco">
      <p className="text-md">📂 Exibindo listas do usuário ID {userId}</p>
    </div>
  );
}
