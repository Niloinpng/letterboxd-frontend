"use client";

import { useState, FormEvent } from 'react';
import Campo from "../Campo";
import { TypeLogin } from '@/app/types/login';
import { validate } from "@/app/utils/LoginValidate";
import { useRouter } from "next/navigation";

export default function LoginForm() {

  const[email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const[erros, setErros] = useState<TypeLogin | null>(null)
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: TypeLogin = {
        email,
        senha
    };

    const validateErros = validate(data);

    console.log(data, validateErros);

    if (Object.keys(validateErros).length > 0) {
        if (validateErros.email) setEmail('');
        if (validateErros.celular) setSenha('');
        setErros(validateErros);
        e.preventDefault();
        return false;
    };
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>

        <div className="flex flex-col justify-center items-center gap-2 mb-6">

            <h1 className="font-ibm font-bold text-branco text-4xl">
                Login
            </h1>

            <p className="font-ibm text-cinza text-center text-lg whitespace-pre-line">
                Bem-vindo de volta ao Letterbox
            </p>

        </div>

        <div className='flex flex-col gap-4'>

        <Campo
            name="email"
            id="email"
            label="E-mail"
            placeholder={erros?.email ? erros.email: "Informe seu melhor e-mail"}
            tipo="text"
            valor={email}
            onChange={(value) => setEmail((value))} 
            iserro={!!erros?.email} 
            onFocus={() => {
                if(erros?.email) {
                setErros(prev => ({ ...prev, email: undefined })); 
                }
            }}
        />

        <Campo
            name="senha"
            id="senha"
            label="Senha"
            placeholder={erros?.senha ? erros.senha: "Informe sua senha"}
            tipo="password"
            valor={senha}
            onChange={(value) => setSenha((value))} 
            iserro={!!erros?.senha} 
            onFocus={() => {
                if(erros?.senha) {
                setErros(prev => ({ ...prev, senha: undefined })); 
                }
            }}
        />

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

