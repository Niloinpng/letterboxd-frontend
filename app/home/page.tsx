"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import CardFilm from "@/app/components/CardFilm";
import { FiSearch } from "react-icons/fi"; 
import { films } from "@/app/data/films";


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra os filmes pelo título digitado na barra de pesquisa
  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar sempre no topo */}
      <Navbar />

      {/* Conteúdo centralizado ocupando toda a tela */}
      <div className="flex-grow flex flex-col items-center bg-preto text-cinza font-ibm gap-4">
        
        {/* Barra de pesquisa */}
        <div className="relative w-80 py-4">
          {/* Input de Pesquisa */}
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 px-4 bg-cinza text-preto font-ibm border-cinza rounded-full 
                      focus:outline-none focus:ring-2 focus:bg-branco focus:border-branco"
          />

          {/* Ícone de Lupa */}
          <FiSearch
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinzaescuro transition-colors duration-200"
            size={18}
          />
        </div>

        {/* Grid de filmes */}
        <div className="grid grid-cols-6 gap-8 justify-items-center">
          {filteredFilms.map((film) => (
            <CardFilm
              key={film.id}
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
