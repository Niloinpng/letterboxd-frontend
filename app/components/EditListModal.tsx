import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaTimes } from "react-icons/fa";

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: {
    id: number;
    name: string;
    description: string;
  } | null;
}

const EditListSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nome muito curto")
    .max(50, "Nome muito longo")
    .required("Nome é obrigatório"),
  description: Yup.string()
    .min(1, "Descrição muito curta")
    .max(200, "Descrição muito longa")
    .required("Descrição é obrigatória"),
});

export default function EditListModal({
  isOpen,
  onClose,
  list,
}: EditListModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    if (!list) return;

    try {
      setSubmitError(null);
      const res = await fetch(`http://localhost:3333/lists/${list.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao atualizar lista");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao atualizar lista"
      );
    }
  };

  if (!list) return null;

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
                  Editar Lista
                </Dialog.Title>

                <Formik
                  initialValues={{
                    name: list.name,
                    description: list.description,
                  }}
                  validationSchema={EditListSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Field
                          name="name"
                          type="text"
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          placeholder="Nome da lista"
                        />
                        {errors.name && touched.name && (
                          <div className="text-vermelho text-sm mt-1">
                            {errors.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          as="textarea"
                          name="description"
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul h-32 resize-none"
                          placeholder="Descrição da lista"
                        />
                        {errors.description && touched.description && (
                          <div className="text-vermelho text-sm mt-1">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      {submitError && (
                        <div className="text-vermelho text-sm">
                          {submitError}
                        </div>
                      )}

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
