import { Dialog } from "@headlessui/react";
import { UserStatistics } from "@/app/types/user-statistics";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStatistics;
}

// Função auxiliar para formatar números com precisão específica
const formatRating = (value: string | number | null | undefined): string => {
  if (value == null) return "N/A";

  //converter para número
  const num = typeof value === "string" ? parseFloat(value) : Number(value);

  //é um número válido?
  if (isNaN(num)) return "N/A";

  //número formatado com uma casa decimal
  return num.toFixed(1);
};

// Função auxiliar para garantir números não negativos
const ensureNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : Math.max(0, num);
};

export default function StatsModal({
  isOpen,
  onClose,
  stats,
}: StatsModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-preto p-6 border border-cinzaescuro">
          <Dialog.Title className="text-xl font-semibold text-branco mb-4">
            Estatísticas de @{stats.username}
          </Dialog.Title>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-cinza">
              <p className="font-semibold text-branco">Avaliações</p>
              <p>{ensureNumber(stats.total_reviews)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Nota Média</p>
              <p>{formatRating(stats.average_rating)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Curtidas Dadas</p>
              <p>{ensureNumber(stats.total_likes_given)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Curtidas Recebidas</p>
              <p>{ensureNumber(stats.total_likes_received)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Seguindo</p>
              <p>{ensureNumber(stats.following_count)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Seguidores</p>
              <p>{ensureNumber(stats.followers_count)}</p>
            </div>
            <div className="text-cinza">
              <p className="font-semibold text-branco">Listas</p>
              <p>{ensureNumber(stats.total_lists)}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-cinzaescuro text-branco hover:bg-opacity-50 transition"
            >
              Fechar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
