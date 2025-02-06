import Navbar from "../components/NavBar";
import CardFilm from "@/app/components/CardFilm";
import { films } from "@/app/data/films";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar sempre no topo */}
      <Navbar />

      {/* Conteúdo centralizado ocupando toda a tela */}
      <div className="flex-grow flex justify-center items-top bg-preto text-cinza font-ibm">
        <div className="grid grid-cols-6 gap-8 justify-items-center pt-8">
          {films.map((film) => (
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
