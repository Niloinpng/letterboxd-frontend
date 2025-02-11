"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import CardFilm from "@/app/components/CardFilm";
import { FiSearch } from "react-icons/fi";

interface Film {
  id: number;
  title: string;
  image: string | null;
  rating: number;
  comments: number;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para converter Buffer para Base64
  const bufferToBase64 = (bufferData: number[]) => {
    const binaryString = bufferData
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return `data:image/jpeg;base64,${btoa(binaryString)}`;
  };

  useEffect(() => {
    async function fetchFilms() {
      try {
        const token = localStorage.getItem("token"); // Pega o token salvo após login
        const res = await fetch("http://localhost:3333/media", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar filmes");

        const data = await res.json();

        // Mapeia os filmes da API e ajusta os dados
        const formattedFilms = data.map((film: any) => ({
          id: film.id,
          title: film.title,
          image: film.cover_url?.data
            ? bufferToBase64(film.cover_url.data)
            : null, // Converte a imagem
          rating: film.average_rating ? parseFloat(film.average_rating) : 5, // Define 5 se não houver
          comments: 5, // Como a API ainda não fornece, definimos 5
        }));

        setFilms(formattedFilms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  // Filtra os filmes pelo título digitado na barra de pesquisa
  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col items-center bg-preto text-cinza font-ibm gap-4">
        {/* Barra de pesquisa */}
        <div className="relative w-80 py-4">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 px-4 bg-cinza text-preto font-ibm border-cinza rounded-full 
                      focus:outline-none focus:ring-2 focus:bg-branco focus:border-branco"
          />
          <FiSearch
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinzaescuro transition-colors duration-200"
            size={18}
          />
        </div>

        {/* Exibir mensagem de carregamento */}
        {loading && (
          <p className="text-branco text-center mt-4">Carregando filmes...</p>
        )}

        {/* Grid de filmes */}
        <div className="grid grid-cols-6 gap-8 justify-items-center">
          {filteredFilms.map((film) => (
            <CardFilm
              key={film.id}
              id={film.id}
              title={film.title}
              image={film.image}
              rating={film.rating}
              comments={film.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
