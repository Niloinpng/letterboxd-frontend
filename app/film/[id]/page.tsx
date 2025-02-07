"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { films } from "@/app/data/films";
import Navbar from "@/app/components/NavBar";
import { FaStar, FaComment } from "react-icons/fa";
import { reviews } from "@/app/data/reviews";
import Review from "@/app/components/Review";
import ReviewFormModal from "@/app/components/ReviewFormModal";
interface FilmPageProps {
  params: { id: string };
}

export default function FilmPage({ params }: FilmPageProps) {
    const [isModelReviews, SetIsModalReviewsOpen] = useState(false);

    const { id } = React.use(params);
    const filmId = Number(id); // Converte ID para número
    const film = films.find((f) => f.id === filmId);
    const filmReviews = reviews;

    if (!film) return notFound(); // Retorna erro 404 se o filme não existir

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
            {film.year} <span className="font-normal pl-4 font-ibm">Dirigido por</span> {film.director}
          </p>

          <p className="text-lg text-cinza leading-relaxed">{film.description}</p>

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
            <button className="bg-cinzaescuro w-44 text-cinza text-sm px-6 py-2 rounded-lg hover:bg-opacity-50 transition">
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
