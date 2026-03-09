export interface Movie {
  id: number;
  tmdbId?: number | null;
  title: string;
  titleUk?: string | null;
  description: string;
  descriptionUk?: string | null;
  posterUrl: string;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  genre: string;
  year: number;
  rating: number;
  duration?: number | null;
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  nameUk: string;
  slug: string;
}

export const GENRES: Record<string, string> = {
  action: "Бойовики",
  comedy: "Комедії",
  drama: "Драми",
  horror: "Жахи",
  "sci-fi": "Фантастика",
  animation: "Анімація",
  documentary: "Документальні",
  romance: "Мелодрами",
  thriller: "Трилери",
};
