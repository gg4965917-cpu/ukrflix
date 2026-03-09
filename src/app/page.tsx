import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MovieRow } from "@/components/MovieRow";
import { GENRES } from "@/types";

async function getMovies() {
  const movies = await db.movie.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  return movies;
}

export default async function HomePage() {
  const movies = await getMovies();

  const featured = movies.find((m) => m.isFeatured) ?? movies[0];
  const newMovies = movies.filter((m) => m.isNew);
  const byGenre = Object.entries(GENRES).map(([slug, nameUk]) => ({
    slug,
    nameUk,
    movies: movies.filter((m) => m.genre === slug),
  })).filter((g) => g.movies.length > 0);

  return (
    <main className="bg-[#141414] min-h-screen">
      <Navbar />
      {featured && <Hero movie={featured} />}

      <div className="relative z-10 -mt-32 pb-20 space-y-8">
        {newMovies.length > 0 && (
          <MovieRow title="🆕 Нові надходження" movies={newMovies} />
        )}
        {byGenre.map((group) => (
          <MovieRow
            key={group.slug}
            title={group.nameUk}
            movies={group.movies}
          />
        ))}
      </div>
    </main>
  );
}
