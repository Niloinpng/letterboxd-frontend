import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface IList {
  id: number;
  name: string;
  description?: string;
}

interface ITag {
  id: number;
  name: string;
}

interface CreateMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMediaSchema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório."),
  type: Yup.string()
    .oneOf(["FILME", "SERIE", "DOCUMENTÁRIO", "LIVRO"])
    .required("Tipo é obrigatório"),
  description: Yup.string().required("Descrição é obrigatória."),
  list_id: Yup.number().nullable(),
  tags: Yup.array().of(Yup.string()),
  newTag: Yup.string(),
});

export function CreateMediaModal({ isOpen, onClose }: CreateMediaModalProps) {
  const [lists, setLists] = useState<IList[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Tipando explicitamente as respostas como Response
        const [listsResponse, tagsResponse]: [Response, Response] =
          await Promise.all([
            fetch("http://localhost:3333/lists/", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            fetch("http://localhost:3333/media/tags/", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

        // if (!listsResponse.ok || !tagsResponse.ok) {
        //   throw new Error(
        //     "Servidor indisponível. Por favor, tente novamente mais tarde."
        //   );
        // }

        const listsData = await listsResponse.json();
        const tagsData = await tagsResponse.json();

        setLists(listsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setFetchError(
          error instanceof Error ? error.message : "Erro ao carregar dados"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (values: {
    title: string;
    type: string;
    description: string;
    list_id?: number;
    tags: string[];
    newTag?: string;
  }) => {
    try {
      setSubmitError(null);

      const allTags = values.newTag
        ? [...values.tags, values.newTag]
        : values.tags;

      const payload = {
        title: values.title,
        type: values.type,
        description: values.description,
        tags: allTags,
        listId: values.list_id,
      };

      const res = await fetch("http://localhost:3333/media/with-tags", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao criar mídia");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao criar mídia"
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
                  Nova Mídia
                </Dialog.Title>

                {(submitError || fetchError) && (
                  <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                    <p className="text-red-500 text-sm">
                      {submitError || fetchError}
                    </p>
                  </div>
                )}

                {loading ? (
                  <p className="text-branco text-center">Carregando dados...</p>
                ) : fetchError ? (
                  <div className="text-center">
                    <button
                      onClick={() => window.location.reload()}
                      className="text-azul hover:underline"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  <Formik
                    initialValues={{
                      title: "",
                      type: "",
                      description: "",
                      release_date: "",
                      list_id: undefined,
                      tags: [],
                      newTag: "",
                    }}
                    validationSchema={CreateMediaSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, setFieldValue }) => (
                      <Form className="space-y-4">
                        <div>
                          <Field
                            name="title"
                            placeholder="Título"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          />
                          {errors.title && touched.title && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.title}
                            </div>
                          )}
                        </div>

                        <div>
                          <Field
                            as="select"
                            name="type"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          >
                            <option value="">Selecione o tipo</option>
                            <option value="FILME">Filme</option>
                            <option value="SERIE">Série</option>
                            <option value="DOCUMENTÁRIO">Documentário</option>
                            <option value="LIVRO">Livro</option>
                          </Field>
                          {errors.type && touched.type && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.type}
                            </div>
                          )}
                        </div>

                        <div>
                          <Field
                            as="textarea"
                            name="description"
                            placeholder="Descrição"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul h-32 resize-none"
                          />
                          {errors.description && touched.description && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <div>
                          <Field
                            as="select"
                            name="list_id"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          >
                            <option value="">
                              Selecione uma lista (opcional)
                            </option>
                            {lists.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div>
                          <Field
                            as="select"
                            multiple
                            name="tags"
                            className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              const values = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              );
                              setFieldValue("tags", values);
                            }}
                          >
                            {tags.map((tag) => (
                              <option key={tag.id} value={tag.name}>
                                {tag.name}
                              </option>
                            ))}
                          </Field>
                          <Field
                            name="newTag"
                            placeholder="Adicionar nova tag"
                            className="mt-2 w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                          />
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="submit"
                            className="w-full bg-azul text-branco py-3 rounded-lg hover:bg-opacity-80 transition"
                          >
                            Criar
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
