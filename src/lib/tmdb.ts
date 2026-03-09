const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p";

export const tmdbImageUrl = (path: string, size = "w500") =>
  `${TMDB_IMAGE}/${size}${path}`;

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
  url.searchParams.set("language", "uk-UA");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
}

export interface TmdbMovieDetails extends TmdbMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  videos?: { results: TmdbVideo[] };
}

export interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export const GENRE_MAP: Record<number, string> = {
  28: "action",
  12: "action",
  16: "animation",
  35: "comedy",
  80: "drama",
  99: "documentary",
  18: "drama",
  10751: "animation",
  14: "sci-fi",
  36: "drama",
  27: "horror",
  10402: "drama",
  9648: "drama",
  10749: "romance",
  878: "sci-fi",
  10770: "drama",
  53: "drama",
  10752: "action",
  37: "action",
};

export async function fetchPopularMovies(page = 1): Promise<TmdbMovie[]> {
  const data = await tmdbFetch("/movie/popular", { page: String(page) });
  return data.results;
}

export async function fetchTopRatedMovies(): Promise<TmdbMovie[]> {
  const data = await tmdbFetch("/movie/top_rated");
  return data.results;
}

export async function fetchMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
  const data = await tmdbFetch(`/movie/${tmdbId}`, {
    append_to_response: "videos",
  });
  return data;
}

export async function fetchMovieTrailer(tmdbId: number): Promise<string | null> {
  try {
    const data = await tmdbFetch(`/movie/${tmdbId}/videos`);
    const trailer = data.results?.find(
      (v: TmdbVideo) =>
        v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ?? data.results?.find(
      (v: TmdbVideo) => v.type === "Trailer" && v.site === "YouTube"
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch {
    return null;
  }
}

export async function searchTmdbMovies(query: string): Promise<TmdbMovie[]> {
  const data = await tmdbFetch("/search/movie", { query });
  return data.results?.slice(0, 10) ?? [];
}

export function tmdbToMovieData(movie: TmdbMovieDetails) {
  const genreId = movie.genres?.[0]?.id ?? movie.genre_ids?.[0];
  const trailerVideo = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return {
    tmdbId: movie.id,
    title: movie.title,
    description: movie.overview || "Опис відсутній",
    posterUrl: movie.poster_path
      ? tmdbImageUrl(movie.poster_path, "w500")
      : "/placeholder-poster.jpg",
    backdropUrl: movie.backdrop_path
      ? tmdbImageUrl(movie.backdrop_path, "original")
      : null,
    trailerUrl: trailerVideo
      ? `https://www.youtube.com/watch?v=${trailerVideo.key}`
      : null,
    genre: GENRE_MAP[genreId] ?? "drama",
    year: movie.release_date
      ? parseInt(movie.release_date.substring(0, 4))
      : new Date().getFullYear(),
    rating: Math.round(movie.vote_average * 10) / 10,
    duration: movie.runtime ?? null,
  };
}
