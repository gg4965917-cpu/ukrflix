import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return true;
}

export async function GET() {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const movies = await db.movie.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(movies);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const movie = await db.movie.create({ data: body });
  return NextResponse.json(movie, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const movie = await db.movie.update({ where: { id }, data });
  return NextResponse.json(movie);
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") ?? "0");
  await db.movie.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
