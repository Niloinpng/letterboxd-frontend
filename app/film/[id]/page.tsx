"use client";

import { useParams, notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/NavBar";
import { FaStar, FaComment } from "react-icons/fa";
import { reviews } from "@/app/data/reviews";
import Review from "@/app/components/Review";
import ReviewFormModal from "@/app/components/ReviewFormModal";
import AddToListModal from "@/app/components/AddToListModal";
interface FilmPageProps {
  params: { id: string };
}

export default function FilmPage({ params }: FilmPageProps) {
    const [isModelReviews, SetIsModalReviewsOpen] = useState(false);
    const [isModalLists, setIsModalListsOpen] = useState(false);
    const [loggedUserId, setLoggedUserId] = useState<number | null>(null);
    const { id } = React.use(params);
    const [film, setFilm] = useState<Film | null>(null);
    const [loading, setLoading] = useState(true);
    const filmReviews = reviews;      

    const bufferToBase64 = (bufferData: number[]) => {
        const binaryString = bufferData.map((byte) => String.fromCharCode(byte)).join("");
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
      };

    useEffect(() => {
        async function fetchFilm() {
          try {
            const res = await fetch(`http://localhost:3333/media/${id}`);
            if (!res.ok) throw new Error("Filme não encontrado");
    
            const data = await res.json();
    
            setFilm({
              id: data.id,
              title: data.title,
              type: data.type,
              description: data.description,
              image: data.cover_url?.data ? bufferToBase64(data.cover_url.data) : null,
              rating: data.average_rating ? parseFloat(data.average_rating) : 5,
              comments: 5,
              tags: data.tags || [],
            });
          } catch (error) {
            console.error(error);
            setFilm(null);
          } finally {
            setLoading(false);
          }
        }

        async function fetchLoggedUser() {
          const token = localStorage.getItem("token");
          if (!token) return;
    
          try {
            const res = await fetch("http://localhost:3333/auth/me", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
    
            if (!res.ok) throw new Error("Erro ao obter usuário logado");
    
            const user = await res.json();
            setLoggedUserId(user.id);
          } catch (error) {
            console.error("Erro ao obter usuário logado:", error);
          }
        }
    
        if (id) fetchFilm();
        fetchLoggedUser();
      }, [id]);
    
      if (loading) return <p className="text-branco text-center mt-4">Carregando filme...</p>;
      if (!film) return notFound();

    return (
    <div className="h-screen flex flex-col">

      <Navbar />

      <div className="flex-grow flex bg-preto text-cinza font-ibm px-16 py-8 gap-8">

      <ReviewFormModal
        isOpen={isModelReviews}
        onClose={() => SetIsModalReviewsOpen(false)}
        onSubmit={(rating, reviewText) => {
          console.log("Review enviada:", { rating, reviewText });
        }}
      />
      
      <AddToListModal
          mediaId={Number(id)}
          userId={loggedUserId}
          isOpen={isModalLists}
          onClose={() => setIsModalListsOpen(false)}
          onSubmit={(listId) => {
            console.log(`Filme "${film.title}" adicionado à lista ${listId}`);
          }}
        />

      <div className="w-full h-96 relative rounded-lg overflow-hidden">
        {film.image ? (
            <Image
                src={film.image}
                alt={film.title}
                fill
                className="object-cover rounded-lg"
            />
        ) : (
            <div className="w-full h-full bg-cinzaescuro flex items-center justify-center text-preto font-bold rounded-lg">
                {film.title}
            </div>
        )}
        </div>


        <div className="flex flex-col">

        <div className="flex flex-row ">

        <div className="w-3/4 flex flex-col gap-4">

          <h1 className="text-6xl font-ibm font-bold text-branco">{film.title}</h1>

          <p className=" text-cinza font-sans font-thin">
            {film.type}
          </p>

          <p className="text-lg text-cinza leading-relaxed">{film.description}</p>
          
          <div className="flex flex-wrap gap-1 pt-2">
                {film.tags.map((tag, index) => (
                  <span key={index} className="bg-cinzaescuro text-cinza text-sm px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
            </div>
        </div>

        <div className="w-1/4 flex flex-col items-center gap-2 justify-between">

            <div className="flex flex-col items-center gap-2 pt-14">
            <p className="text-6xl text-cinza font-sans">{film.rating}</p>

            <div className="flex flex-row gap-0.5 pb-4">
            {Array.from({ length: film.rating }, (_, i) => (
            <FaStar key={i} className="text-cinza text-xl" />
            ))}
            </div>
            </div>
        
            <div className="flex flex-col items-center gap-2">
            <button className="bg-cinzaescuro w-44 text-cinza text-sm px-6 py-2 rounded-lg hover:bg-opacity-50 transition"
                    onClick={() => SetIsModalReviewsOpen(true)}
            >
                Faça sua Review
            </button>
            <button className="bg-cinzaescuro w-44 text-cinza text-sm px-6 py-2 rounded-lg hover:bg-opacity-50 transition"
                    onClick={() => setIsModalListsOpen(true)}
            >
                Adicionar em Lista
            </button>
            </div>

        </div>

        </div >

        <div className="flex items-center gap-1 pt-6 justify-between">
            <h3 className="text-cinza font-sans">REVIEWS</h3>
            <span className="flex flex-row items-center gap-1">
                <FaComment className="text-cinza" size={14} />
                <span className="text-cinza font-sans">{film.comments}</span>
            </span>
        </div>

        <hr className="w-full border-t-2 rounded-full border-cinza " />

        {filmReviews.map((review) => (
            <Review key={review.id} {...review}/>
        ))}
        </div>

      </div>
    </div>
  );
}
