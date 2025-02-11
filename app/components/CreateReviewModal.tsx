import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa";

interface IMedia {
  id: number;
  title: string;
  type: string;
  description?: string;
  release_date?: Date;
  cover_url?: string;
  created_at: Date;
  updated_at: Date;
  average_rating?: number;
}

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const CreateReviewSchema = Yup.object().shape({
  media_id: Yup.number().required("Selecione uma mídia"),
  rating: Yup.number().min(1).max(5).required("Avaliação é obrigatória"),
  content: Yup.string()
    .min(10, "Avaliação muito curta")
    .max(500, "Avaliação muito longa")
    .required("Conteúdo é obrigatório"),
});

export function CreateReviewModal({
  isOpen,
  onClose,
  userId,
}: CreateReviewModalProps) {
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

  const handleSubmit = async (values: {
    media_id: number;
    rating: number;
    content: string;
  }) => {
    try {
      setSubmitError(null);

      const payload = {
        user_id: userId,
        media_id: Number(values.media_id),
        rating: Number(values.rating),
        content: values.content,
      };

      const res = await fetch("http://localhost:3333/review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao criar avaliação");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao criar avaliação"
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
                  Nova Avaliação
                </Dialog.Title>

                {submitError && (
                  <div className="mb-4 p-3 bg-vermelho bg-opacity-10 border border-vermelho rounded-lg">
                    <p className="text-vermelho text-sm">{submitError}</p>
                  </div>
                )}

                {loading ? (
                  <p className="text-branco text-center">
                    Carregando mídias...
                  </p>
                ) : (
                  <Formik
                    initialValues={{
                      media_id: Number(""),
                      rating: 0,
                      content: "",
                    }}
                    validationSchema={CreateReviewSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, values, setFieldValue }) => (
                      <Form className="space-y-4">
                        <div>
                          <Field
                            as="select"
                            name="media_id"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          >
                            <option value="">Selecione uma mídia</option>
                            {mediaList.map((media) => (
                              <option key={media.id} value={media.id}>
                                {media.title} ({media.type})
                              </option>
                            ))}
                          </Field>
                          {errors.media_id && touched.media_id && (
                            <div className="text-vermelho text-sm mt-1">
                              {errors.media_id}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFieldValue("rating", star)}
                                className="focus:outline-none"
                              >
                                <FaStar
                                  className={`w-8 h-8 ${
                                    star <= values.rating
                                      ? "text-amarelo"
                                      : "text-cinzaescuro"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {errors.rating && touched.rating && (
                            <div className="text-vermelho text-sm">
                              {errors.rating}
                            </div>
                          )}
                        </div>

                        <div>
                          <Field
                            as="textarea"
                            name="content"
                            placeholder="Escreva sua avaliação..."
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul h-32 resize-none"
                          />
                          {errors.content && touched.content && (
                            <div className="text-vermelho text-sm mt-1">
                              {errors.content}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="submit"
                            className="w-full bg-azul text-branco py-3 rounded-lg hover:bg-opacity-80 transition"
                          >
                            Publicar
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
