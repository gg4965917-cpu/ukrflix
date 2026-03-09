"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Star } from "lucide-react";
import type { Movie } from "@/types";
import { GENRES } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const title = movie.titleUk || movie.title;

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="movie-card relative group cursor-pointer rounded overflow-hidden bg-zinc-900 min-w-[160px] md:min-w-[200px]">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.posterUrl || "/placeholder-poster.jpg"}
            alt={title}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {movie.isNew && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              title="Дивитися"
            >
              <Play size={16} className="fill-black text-black ml-0.5" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-500 flex items-center justify-center transition-colors"
              title="До списку"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2">
          <p className="text-white text-xs font-semibold truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-yellow-400 text-[10px]">
              <Star size={10} className="fill-yellow-400" />
              {movie.rating.toFixed(1)}
            </span>
            <span className="text-zinc-500 text-[10px]">{movie.year}</span>
            {movie.genre && (
              <span className="text-zinc-500 text-[10px] truncate">
                {GENRES[movie.genre] ?? movie.genre}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
