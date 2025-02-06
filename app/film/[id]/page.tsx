import { notFound } from "next/navigation";
import Image from "next/image";
import { films } from "@/app/data/films";
import Navbar from "@/app/components/NavBar";
import { FaStar, FaComment } from "react-icons/fa";

interface FilmPageProps {
  params: { id: string };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const filmId = Number(params.id); // Converte ID para número
  const film = films.find((f) => f.id === filmId);

  if (!film) return notFound(); // Retorna erro 404 se o filme não existir

  return (
    <div className="h-screen flex flex-col">

      <Navbar />

      <div className="flex-grow flex bg-preto text-cinza font-ibm px-16 py-8 gap-8">
        
        <div className="w-64 h-96 flex justify-start rounded-lg">
          {film.image ? (
            <Image
              src={film.image}
              alt={film.title}
              width={250} // Mantém proporção correta
              height={380} 
              className="rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div className="w-64 h-96 bg-cinzaescuro flex items-center justify-center text-preto font-bold rounded-lg">
              {film.title}
            </div>
          )}
        </div>

        <div className="flex flex-col">

        <div className="flex flex-row ">

        <div className="w-3/4 flex flex-col gap-4">

          <h1 className="text-6xl font-ibm font-bold text-branco">{film.title}</h1>

          <p className=" text-cinza font-sans font-thin">
            {film.year} <span className="font-normal pl-4">Dirigido por</span> {film.director}
          </p>

          <p className="text-lg text-cinza leading-relaxed">{film.description}</p>

        </div>

        <div className="w-1/4 flex flex-col items-center gap-2">
        
            <FaStar className="text-cinza text-3xl" />
            <p className="text-4xl text-cinza font-sans pb-4">{film.rating}</p>
            <button className="bg-cinzaescuro text-cinza px-6 py-2 rounded-lg hover:bg-opacity-50 transition">
                Faça sua Review
            </button>

        </div>

        </div >

        <div className="flex items-center gap-1 pt-4">
        <FaComment className="text-cinza" size={14} />
        <span className="text-cinza font-sans">{film.comments}</span>
        </div>

        <hr className="w-full border-t border-cinza " />

        </div>

      </div>
    </div>
  );
}
