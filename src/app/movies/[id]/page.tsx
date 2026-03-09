import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, Star, Clock, Calendar, Globe } from "lucide-react";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { MovieRow } from "@/components/MovieRow";
import { GENRES } from "@/types";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const movie = await db.movie.findUnique({ where: { id: parseInt(params.id) } });
  if (!movie) return { title: "Фільм не знайдено" };
  return {
    title: `${movie.titleUk || movie.title} — УкрФлікс`,
    description: movie.descriptionUk || movie.description,
  };
}

export default async function MoviePage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const movie = await db.movie.findUnique({ where: { id } });
  if (!movie || !movie.isPublished) notFound();

  const related = await db.movie.findMany({
    where: { genre: movie.genre, id: { not: id }, isPublished: true },
    take: 10,
  });

  const title = movie.titleUk || movie.title;
  const description = movie.descriptionUk || movie.description;

  return (
    <main className="bg-[#141414] min-h-screen">
      <Navbar />

      {/* Hero backdrop */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Назад</span>
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
            <Image
              src={movie.posterUrl}
              alt={title}
              width={256}
              height={384}
              className="object-cover w-full"
            />
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {movie.isNew && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                  НОВИНКА
                </span>
              )}
              <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded border border-zinc-700">
                🇺🇦 Українська озвучка
              </span>
              <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded border border-zinc-700">
                {GENRES[movie.genre] ?? movie.genre}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
              {title}
            </h1>
            {movie.titleUk && movie.title !== movie.titleUk && (
              <p className="text-zinc-500 text-sm mb-4">{movie.title}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 mb-6 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
                <span>/ 10</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {movie.year}
              </span>
              {movie.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {Math.floor(movie.duration / 60)}г {movie.duration % 60}хв
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Globe size={16} />
                Українська
              </span>
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {movie.videoUrl ? (
                <a href={movie.videoUrl} target="_blank" rel="noopener noreferrer">
                  <button className="btn-red text-base px-10 py-3.5">
                    <Play size={22} className="fill-white" />
                    Дивитися зараз
                  </button>
                </a>
              ) : movie.trailerUrl ? (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <button className="btn-gray text-base px-10 py-3.5">
                    <Play size={22} className="fill-white" />
                    Трейлер
                  </button>
                </a>
              ) : (
                <button
                  disabled
                  className="btn-gray text-base px-10 py-3.5 opacity-50 cursor-not-allowed"
                >
                  <Play size={22} />
                  Незабаром
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <MovieRow
              title={`Більше фільмів — ${GENRES[movie.genre] ?? movie.genre}`}
              movies={related}
            />
          </div>
        )}
      </div>

      <div className="h-20" />
    </main>
  );
}
