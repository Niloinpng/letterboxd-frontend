import { TypeUser } from '@/app/types/user';

type Error = {
  [key: string]: string;
};

const isEmail = (str: string): boolean => {
  if (str.length <= 4) return false;
  const posArroba: number = str.indexOf("@");
  const posDot: number = str.lastIndexOf(".");
  return posArroba >= 0 && posDot > posArroba;
};

export const validate = (data: TypeUser): Error => {
  const erros: Error = {};

  if (!data.email) {
    erros["email"] = "Informe seu e-mail";
  } else if (!isEmail(data.email)) {
    erros["email"] = "E-mail inválido";
  }

  if (!data.name) {
    erros["name"] = "Informe seu nome completo";
  }

  if (!data.username) {
    erros["username"] = "Crie seu username";
  }

  if (!data.senha) {
    erros["senha"] = "Informe sua senha";
  }

  return erros;
};