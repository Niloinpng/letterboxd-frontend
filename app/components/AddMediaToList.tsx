import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface IMedia {
  id: number;
  title: string;
  type: string;
}

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: number;
  onAddMedia: (newMedia: any) => void;
}

const AddMediaSchema = Yup.object().shape({
  mediaId: Yup.number().required("Selecione uma mídia"),
});

export default function AddMediaModal({
  isOpen,
  onClose,
  listId,
  onAddMedia,
}: AddMediaModalProps) {
  const [mediaList, setMediaList] = useState<IMedia[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("http://localhost:3333/media/");
        if (!response.ok) throw new Error("Falha ao carregar mídias");
        const data = await response.json();
        setMediaList(data);
      } catch (error) {
        console.error("Erro ao carregar mídias:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleSubmit = async (values: { mediaId: number }) => {
    try {
      setSubmitError(null);

      // Primeiro, adiciona a mídia à lista
      const res = await fetch("http://localhost:3333/list-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          list_id: listId,
          media_id: Number(values.mediaId),
          status: "PENDENTE",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || "Erro ao adicionar mídia à lista"
        );
      }

      // Pega a resposta do servidor
      const responseData = await res.json();

      // Encontra os dados completos da mídia na lista que já carregamos
      const selectedMedia = mediaList.find(
        (media) => media.id === Number(values.mediaId)
      );

      if (!selectedMedia) {
        throw new Error("Mídia não encontrada");
      }

      // Cria o objeto com a estrutura correta
      const newListItem = {
        id: responseData.id, // ID retornado pelo servidor
        list_id: listId,
        media_id: selectedMedia.id,
        media: {
          id: selectedMedia.id,
          title: selectedMedia.title,
          type: selectedMedia.type,
        },
      };

      // Passa os dados completos para o callback
      onAddMedia(newListItem);
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar mídia:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Erro ao adicionar mídia à lista"
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-preto p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-branco mb-6"
                >
                  Adicionar Mídia à Lista
                </Dialog.Title>

                {loading ? (
                  <p className="text-branco text-center">
                    Carregando mídias...
                  </p>
                ) : (
                  <Formik
                    initialValues={{ mediaId: 0 }}
                    validationSchema={AddMediaSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-4">
                        <div>
                          <Field
                            as="select"
                            name="mediaId"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          >
                            <option value="">Selecione uma mídia</option>
                            {mediaList.map((media) => (
                              <option key={media.id} value={media.id}>
                                {media.title} ({media.type})
                              </option>
                            ))}
                          </Field>
                          {errors.mediaId && touched.mediaId && (
                            <div className="text-vermelho text-sm mt-1">
                              {errors.mediaId}
                            </div>
                          )}
                        </div>

                        {submitError && (
                          <div className="text-vermelho text-sm mt-2">
                            {submitError}
                          </div>
                        )}

                        <div className="flex gap-3 mt-6">
                          <button
                            type="submit"
                            className="w-full bg-azul text-branco py-3 rounded-lg hover:bg-opacity-80 transition"
                          >
                            Adicionar
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-cinzaescuro text-branco py-3 rounded-lg hover:bg-opacity-50 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
