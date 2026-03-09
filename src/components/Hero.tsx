"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star, Clock } from "lucide-react";
import type { Movie } from "@/types";

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  const title = movie.titleUk || movie.title;
  const description = movie.descriptionUk || movie.description;

  return (
    <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">
      {/* Backdrop */}
      {movie.backdropUrl && (
        <Image
          src={movie.backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      )}

      {/* Gradients */}
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-bottom absolute bottom-0 left-0 right-0 h-48" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-16 w-full">
          <div className="max-w-xl animate-fade-in">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              {movie.isNew && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                  НОВИНКА
                </span>
              )}
              <span className="text-zinc-400 text-sm uppercase tracking-wider">
                🇺🇦 Українська озвучка
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 text-sm text-zinc-300">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                {movie.rating.toFixed(1)}
              </span>
              <span>{movie.year}</span>
              {movie.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {Math.floor(movie.duration / 60)}г {movie.duration % 60}хв
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
              {description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/movies/${movie.id}`}>
                <button className="btn-red text-base px-8 py-3">
                  <Play size={20} className="fill-white" />
                  Дивитися
                </button>
              </Link>
              <Link href={`/movies/${movie.id}`}>
                <button className="btn-gray text-base px-8 py-3">
                  <Info size={20} />
                  Детальніше
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
