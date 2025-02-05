"use client";

import { useState, FormEvent } from 'react';
import Campo from "../Campo";
import { TypeUser } from '@/app/types/user';
import { validate } from "@/app/utils/RegisterValidate";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const[email, setEmail] = useState('');
  const[name, setName] = useState('');
  const[username, setUsername] = useState('');
  const[senha, setSenha] = useState('');
  const[erros, setErros] = useState<TypeUser | null>(null)
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: TypeUser = {
        email,
        name,
        username,
        senha
    };

    const validateErros = validate(data);

    console.log(data, validateErros);

    if (Object.keys(validateErros).length > 0) {
        if (validateErros.email) setEmail('');
        if (validateErros.name) setName('');
        if (validateErros.username) setUsername('');
        if (validateErros.celular) setSenha('');
        setErros(validateErros);
        e.preventDefault();
        return false;
    };
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>

    <div className="flex flex-col justify-center items-center gap-2">

        <h1 className="font-ibm font-bold text-branco text-4xl">
            Cadastro
        </h1>

        <p className="font-ibm text-cinza text-center text-sm whitespace-pre-line">
            Realize o cadastro no sistema com suas informações pessoais. 
        </p>

    </div>

    <div className='flex flex-col gap-2'>

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
        name="name"
        id="name"
        label="Nome"
        placeholder={erros?.name ? erros.name: "Informe seu nome completo"}
        tipo="text"
        valor={name}
        onChange={(value) => setName((value))} 
        iserro={!!erros?.name} 
        onFocus={() => {
            if(erros?.name) {
            setErros(prev => ({ ...prev, name: undefined })); 
            }
        }}
    />

    <Campo
        name="username"
        id="username"
        label="Username"
        placeholder={erros?.name ? erros.name: "Crie um username"}
        tipo="text"
        valor={username}
        onChange={(value) => setUsername((value))} 
        iserro={!!erros?.username} 
        onFocus={() => {
            if(erros?.username) {
            setErros(prev => ({ ...prev, username: undefined })); 
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

    <div className="flex flex-col align-middle items-center mt-2">
        <button 
            type="submit"
            className="bg-azul rounded-md text-xs w-60 text-center align-middle font-ibm font-bold text-white p-3 hover:bg-opacity-50"
            >
            CADASTRAR
        </button>
    </div>

    </div>

    </form>
  );
}
