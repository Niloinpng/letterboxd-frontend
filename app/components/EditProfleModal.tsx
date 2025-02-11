import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    bio: string;
  };
}

const EditProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  username: Yup.string()
    .min(3, "Username muito curto")
    .max(30, "Username muito longo")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username pode conter apenas letras, números e _"
    ),
  email: Yup.string().email("Email inválido"),
  password: Yup.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  bio: Yup.string().max(500, "Bio muito longa"),
});

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: any) => {
    // Remove empty fields from the submission
    const updateData = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== "")
    );

    try {
      const res = await fetch(`http://localhost:3333/users/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      window.location.reload();
    } catch (error) {
      console.error(error);
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
                  Editar Perfil
                </Dialog.Title>

                <Formik
                  initialValues={{
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    bio: "",
                  }}
                  validationSchema={EditProfileSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Field
                          name="name"
                          placeholder={user.name}
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                        />
                        {errors.name && touched.name && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          name="username"
                          placeholder={user.username}
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                        />
                        {errors.username && touched.username && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          name="email"
                          type="email"
                          placeholder={user.email}
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nova senha"
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Image
                            src={showPassword ? "/eyeSlash.svg" : "/eye.svg"}
                            alt={
                              showPassword ? "Esconder senha" : "Mostrar senha"
                            }
                            width={24}
                            height={24}
                          />
                        </button>
                        {errors.password && touched.password && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          as="textarea"
                          name="bio"
                          placeholder={user.bio}
                          className="w-full bg-cinzaescuro text-branco rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-azul h-32 resize-none"
                        />
                        {errors.bio && touched.bio && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.bio}
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
