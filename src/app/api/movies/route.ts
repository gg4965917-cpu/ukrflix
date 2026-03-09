import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = { isPublished: true };
  if (genre) where.genre = genre;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { titleUk: { contains: search } },
    ];
  }

  const [movies, total] = await Promise.all([
    db.movie.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.movie.count({ where }),
  ]);

  return NextResponse.json({ movies, total, page, limit });
}
