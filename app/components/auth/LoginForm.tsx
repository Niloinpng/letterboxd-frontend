"use client";
import { useState, FormEvent } from "react";
import Campo from "../Campo";
import { TypeLogin } from "@/app/types/login";
import { validate } from "@/app/utils/LoginValidate";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LoginResponse {
  access_token: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<TypeLogin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer login");
      }

      const data: LoginResponse = await response.json();

      //salvar o token no localStorage
      localStorage.setItem("token", data.access_token);
      setLoginError(null);
      //verificar qual é a página após o login e redirecionar (router.push)
      router.push("/home");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
      console.error("Erro no login:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const data: TypeLogin = {
      username,
      senha,
    };

    const validateErros = validate(data);

    if (Object.keys(validateErros).length > 0) {
      if (validateErros.username) setUsername("");
      if (validateErros.senha) setSenha("");
      setErros(validateErros);
      return false;
    }

    //se passou pela validação, tenta fazer o login
    await handleLogin(username, senha);
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center gap-2 mb-6">
        <h1 className="font-ibm font-bold text-branco text-4xl">Login</h1>
        <p className="font-ibm text-cinza text-center text-lg whitespace-pre-line">
          Bem-vindo de volta ao Letterbox
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Campo
          name="username"
          id="username"
          label="Username"
          placeholder={erros?.username ? erros.username : "Digite seu username"}
          tipo="text"
          valor={username}
          onChange={(value) => setUsername(value)}
          iserro={!!erros?.username}
          onFocus={() => {
            if (erros?.username) {
              setErros((prev) => ({ ...prev, username: undefined }));
            }
            setLoginError(null);
          }}
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
            onFocus={() => {
              if (erros?.senha) {
                setErros((prev) => ({ ...prev, senha: undefined }));
              }
              setLoginError(null);
            }}
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

        <div className="pt-2">
          {loginError && (
            <div className="bg-laranja p-3 rounded-md text-sm text-white">
              {loginError}
            </div>
          )}
        </div>

        <div className="flex flex-col align-middle items-center">
          <button
            type="submit"
            className="bg-azul rounded-md text-xs w-60 text-center align-middle font-ibm font-bold text-white p-3 hover:bg-opacity-50"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </form>
  );
}
