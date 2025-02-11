import { Dialog } from "@headlessui/react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: AlertModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-preto p-6 border border-cinzaescuro">
          <Dialog.Title className="text-xl font-semibold text-branco mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-cinza mb-6">
            {message}
          </Dialog.Description>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-cinzaescuro text-branco hover:bg-opacity-50 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-lg bg-red-700 text-branco hover:bg-opacity-80 transition"
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
