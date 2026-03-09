import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  fetchPopularMovies,
  fetchMovieDetails,
  tmdbToMovieData,
  searchTmdbMovies,
} from "@/lib/tmdb";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return !!session;
}

// GET /api/admin/sync?action=search&q=avatar
// GET /api/admin/sync?action=popular
export async function GET(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY не налаштовано. Додайте його у .env файл." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const query = searchParams.get("q");

  if (action === "search" && query) {
    const results = await searchTmdbMovies(query);
    return NextResponse.json(results);
  }

  if (action === "popular") {
    const results = await fetchPopularMovies();
    return NextResponse.json(results);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// POST /api/admin/sync — import single movie by tmdbId
// POST /api/admin/sync?action=bulk — import top 20 popular
export async function POST(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY не налаштовано" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "bulk") {
    // Import top 20 popular movies
    const movies = await fetchPopularMovies();
    let imported = 0;
    let skipped = 0;

    for (const m of movies.slice(0, 20)) {
      const existing = await db.movie.findUnique({ where: { tmdbId: m.id } });
      if (existing) { skipped++; continue; }

      try {
        const details = await fetchMovieDetails(m.id);
        const data = tmdbToMovieData(details);
        await db.movie.create({ data });
        imported++;
      } catch {
        // skip failed imports
      }
    }

    return NextResponse.json({ imported, skipped });
  }

  // Single movie import
  const body = await req.json();
  const { tmdbId } = body;

  if (!tmdbId) {
    return NextResponse.json({ error: "tmdbId required" }, { status: 400 });
  }

  const existing = await db.movie.findUnique({ where: { tmdbId } });
  if (existing) {
    return NextResponse.json(
      { error: "Фільм вже існує в базі", movie: existing },
      { status: 409 }
    );
  }

  const details = await fetchMovieDetails(tmdbId);
  const data = tmdbToMovieData(details);
  const movie = await db.movie.create({ data });

  return NextResponse.json({ success: true, movie }, { status: 201 });
}
