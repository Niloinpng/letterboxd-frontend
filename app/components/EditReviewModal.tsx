import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa";

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    review_id: number;
    rating: number;
    review_content: string;
    media_title: string;
  };
}

const EditReviewSchema = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required("Avaliação é obrigatória"),
  review_content: Yup.string()
    .min(10, "Avaliação muito curta")
    .max(500, "Avaliação muito longa")
    .required("Conteúdo é obrigatório"),
});

export function EditReviewModal({
  isOpen,
  onClose,
  review,
}: EditReviewModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    rating: number;
    review_content: string;
  }) => {
    try {
      setSubmitError(null);

      const payload = {
        rating: Number(values.rating),
        content: values.review_content, 
      };

      const res = await fetch(
        `http://localhost:3333/review/${review.review_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao atualizar avaliação");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao atualizar avaliação"
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
                  Editar Avaliação - {review.media_title}
                </Dialog.Title>

                <Formik
                  initialValues={{
                    rating: review.rating,
                    review_content: review.review_content,
                  }}
                  validationSchema={EditReviewSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-4">
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
                          name="review_content"
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul h-32 resize-none"
                        />
                        {errors.review_content && touched.review_content && (
                          <div className="text-vermelho text-sm mt-1">
                            {errors.review_content}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="submit"
                          className="w-full bg-azul text-branco py-3 rounded-lg hover:bg-opacity-80 transition"
                        >
                          Salvar
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
