"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      const amount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="px-4 md:px-8 group/row">
      <h2 className="text-white text-lg md:text-xl font-bold mb-3 pl-1">
        {title}
      </h2>
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full bg-gradient-to-r from-black/80 to-transparent flex items-center justify-start pl-1
            opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft size={28} className="text-white" />
        </button>

        {/* Movie scroll */}
        <div
          ref={rowRef}
          className="movie-row flex gap-2 md:gap-3 overflow-x-auto pb-2"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full bg-gradient-to-l from-black/80 to-transparent flex items-center justify-end pr-1
            opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
}
