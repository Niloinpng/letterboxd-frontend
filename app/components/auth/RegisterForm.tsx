"use client";

import { useState, FormEvent } from "react";
import Campo from "../Campo";
import { TypeUser } from "@/app/types/user";
import { validate } from "@/app/utils/RegisterValidate";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<TypeUser | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data: TypeUser = {
      email,
      name,
      username,
      senha,
    };

    // Validação antes de enviar
    const validateErros = validate(data);

    if (Object.keys(validateErros).length > 0) {
      setErros(validateErros);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          bio: "sou a sua bio",
          username,
          password: senha, // O backend espera "password", não "senha"
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/home"); // Redireciona para a tela de login
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar. Verifique os dados.");
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

        <Campo
          name="senha"
          id="senha"
          label="Senha"
          placeholder={erros?.senha ? erros.senha : "Informe sua senha"}
          tipo="password"
          valor={senha}
          onChange={(value) => setSenha(value)}
          iserro={!!erros?.senha}
          onFocus={() => setErros((prev) => ({ ...prev, senha: undefined }))}
        />

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
