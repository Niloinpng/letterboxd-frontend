"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";

type LoginFormInputs = {
  email: string;
  password: string;
  name?: string; // Campo extra para cadastro
  confirmPassword?: string; // Campo extra para cadastro
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true); // Alterna entre login e cadastro

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoginError(null); // Reset error on new submission
    try {
      console.log("Dados enviados:", data);
      if (isLogin) {
        // Simulação de login
        if (data.email !== "admin@email.com" || data.password !== "123456") {
          throw new Error("Credenciais inválidas");
        }
        alert("Login bem-sucedido!");
      } else {
        // Simulação de cadastro
        if (data.password !== data.confirmPassword) {
          throw new Error("As senhas não coincidem!");
        }
        alert("Cadastro realizado com sucesso!");
      }
    } catch (error) {
      setLoginError((error as Error).message);
    }
  };

  return (
    <div className="flex h-screen bg-preto py-14 px-48">
      {/* Coluna Esquerda - 40% */}
      <div className="w-2/5 flex flex-col justify-center items-center p-8 bg-branco rounded-l-xl gap-2">
      
        <div className="flex gap-0.5">
          <div className="w-8 h-8 bg-verde rounded-full"></div>
          <div className="w-8 h-8 bg-azul rounded-full"></div>
          <div className="w-8 h-8 bg-laranja rounded-full"></div>
        </div>

        <h1 className="font-ibm font-bold text-preto text-4xl">
          Letterbox
        </h1>
        
        <p className="font-ibm text-cinzaescuro text-center text-lg whitespace-pre-line">
        {isLogin
          ? "Ainda não tem uma conta?\nCadastre-se agora!"
          : "Já tem uma conta?\nFaça login!"}
        </p>

        <Button
          variant="contained"
          style={{ backgroundColor: "#00E054", fontWeight:"bold" }}
          onClick={() => setIsLogin(!isLogin)}
          className="w-48 font-ibm text-lg"
        >
          {isLogin ? "Criar Conta" : "Fazer Login"}
        </Button>
      </div>

      {/* Coluna Direita - 60% */}
      <div className="w-3/5 flex flex-col justify-center items-center bg-cinzaescuro px-20 py-10 rounded-r-xl gap-2">
        <h1 className="font-ibm text-4xl text-branco font-bold">
          {isLogin ? "Login" : "Cadastro"}
        </h1>
        <p className="font-ibm text-cinza text-lg text-center">
          {isLogin ? "Bem-vindo de volta ao Letterbox" : "Preencha seus dados para criar uma conta"}
        </p>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          {/* Campos do Cadastro */}
          {!isLogin && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Nome Completo"
                {...register("name", { required: "O nome é obrigatório" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{ style: { fontFamily: "IBM Plex Sans" } }} // Aplica a fonte
              />
            </>
          )}

          {/* Campos comuns (Login e Cadastro) */}
          <TextField
            fullWidth
            margin="normal"
            label="E-mail"
            type="email"
            {...register("email", { required: "O e-mail é obrigatório" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ style: { fontFamily: "IBM Plex Sans" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            {...register("password", { required: "A senha é obrigatória" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{ style: { fontFamily: "IBM Plex Sans" } }}
          />

          {/* Campo de confirmação de senha no cadastro */}
          {!isLogin && (
            <TextField
              fullWidth
              margin="normal"
              label="Confirme sua Senha"
              type="password"
              {...register("confirmPassword", { required: "Confirme sua senha" })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{ style: { fontFamily: "IBM Plex Sans" } }}
            />
          )}

          {loginError && (
            <Typography color="error" className="mt-2 font-ibm">
              {loginError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4 font-ibm text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
