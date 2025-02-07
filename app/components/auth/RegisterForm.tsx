"use client";

import { useState, FormEvent } from "react";
import Campo from "../Campo";
import { TypeUser } from "@/app/types/user";
import { validate } from "@/app/utils/RegisterValidate";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erros, setErros] = useState<TypeUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    const data: TypeUser = {
      email,
      name,
      username,
      senha,
      confirmarSenha,
    };

    //Validação antes de enviar
    const validateErros = validate(data);

    if (Object.keys(validateErros).length > 0) {
      setErros(validateErros);
      return;
    }

    //validação das senhas
    if (senha !== confirmarSenha) {
      setErros((prev) => ({
        ...prev,
        senha: "As senhas não coincidem",
        confirmarSenha: "As senhas não coincidem",
      }));
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3333/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          bio: "sou a sua bio",
          username,
          password: senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar usuário");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      alert("Cadastro realizado com sucesso!");
      router.push("/home");
    } catch (error) {
      setSignUpError(
        error instanceof Error ? error.message : "Erro ao cadastrar usuário"
      );
      console.error("Erro no cadastro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="font-ibm font-bold text-branco text-4xl">Cadastro</h1>
        <p className="font-ibm text-cinza text-center text-sm whitespace-pre-line">
          Realize o cadastro no sistema com suas informações pessoais.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Campo
          name="email"
          id="email"
          label="E-mail"
          placeholder={erros?.email ? erros.email : "Informe seu melhor e-mail"}
          tipo="text"
          valor={email}
          onChange={(value) => setEmail(value)}
          iserro={!!erros?.email}
          onFocus={() => setErros((prev) => ({ ...prev, email: undefined }))}
        />

        <Campo
          name="name"
          id="name"
          label="Nome"
          placeholder={erros?.name ? erros.name : "Informe seu nome completo"}
          tipo="text"
          valor={name}
          onChange={(value) => setName(value)}
          iserro={!!erros?.name}
          onFocus={() => setErros((prev) => ({ ...prev, name: undefined }))}
        />

        <Campo
          name="username"
          id="username"
          label="Username"
          placeholder={erros?.username ? erros.username : "Crie um username"}
          tipo="text"
          valor={username}
          onChange={(value) => setUsername(value)}
          iserro={!!erros?.username}
          onFocus={() => setErros((prev) => ({ ...prev, username: undefined }))}
        />

        <div className="relative">
          <Campo
            name="senha"
            id="senha"
            label="Senha"
            placeholder={erros?.senha ? erros.senha : "Informe sua senha"}
            tipo={showPassword ? "text" : "password"}
            valor={senha}
            onChange={(value) => setSenha(value)}
            iserro={!!erros?.senha}
            onFocus={() => setErros((prev) => ({ ...prev, senha: undefined }))}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-9 cursor-pointer"
          >
            <Image
              src={showPassword ? "/eyeSlash.svg" : "/eye.svg"}
              alt={showPassword ? "Esconder senha" : "Mostrar senha"}
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="relative">
          <Campo
            name="confirmarSenha"
            id="confirmarSenha"
            label="Confirmar Senha"
            placeholder={
              erros?.confirmarSenha
                ? erros.confirmarSenha
                : "Confirme sua senha"
            }
            tipo={showConfirmPassword ? "text" : "password"}
            valor={confirmarSenha}
            onChange={(value) => setConfirmarSenha(value)}
            iserro={!!erros?.confirmarSenha}
            onFocus={() =>
              setErros((prev) => ({ ...prev, confirmarSenha: undefined }))
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-6 top-9 cursor-pointer"
          >
            <Image
              src={showConfirmPassword ? "/eyeSlash.svg" : "/eye.svg"}
              alt={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="pt-2">
          {signUpError && (
            <div className="bg-laranja p-3 rounded-md text-sm text-white">
              {signUpError}
            </div>
          )}
        </div>

        <div className="flex flex-col align-middle items-center mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-azul rounded-md text-xs w-60 text-center align-middle font-ibm font-bold text-white p-3 hover:bg-opacity-50"
          >
            {loading ? "Cadastrando..." : "CADASTRAR"}
          </button>
        </div>
      </div>
    </form>
  );
}
