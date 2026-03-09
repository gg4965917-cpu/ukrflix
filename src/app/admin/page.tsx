import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [totalMovies, publishedMovies, newMovies, featuredMovies] =
    await Promise.all([
      db.movie.count(),
      db.movie.count({ where: { isPublished: true } }),
      db.movie.count({ where: { isNew: true } }),
      db.movie.count({ where: { isFeatured: true } }),
    ]);

  const recentMovies = await db.movie.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = { totalMovies, publishedMovies, newMovies, featuredMovies };

  return <AdminDashboard stats={stats} recentMovies={recentMovies} />;
}
