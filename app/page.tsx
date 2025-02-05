"use client";

import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex h-screen bg-preto py-8 px-48">
      <div className="w-2/5 flex flex-col justify-center items-center p-8 bg-branco rounded-l-xl gap-4">

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

        <button 
            onClick={() => setIsLogin(!isLogin)}
            className="bg-verde rounded-md text-xs w-48 text-center align-middle font-ibm font-bold text-white p-3 hover:bg-opacity-50"
            >
            {isLogin ? "CRIAR CONTA" : "FAZER LOGIN"}
        </button>

      </div>

      <div className="w-3/5 flex flex-col justify-center items-center bg-cinzaescuro px-20 py-10 rounded-r-xl gap-2">

        {isLogin ? <LoginForm /> : <RegisterForm />}

      </div>
    </div>
  );
}
