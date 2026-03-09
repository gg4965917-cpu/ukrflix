import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@ukrflix.com" },
    update: {},
    create: {
      email: "admin@ukrflix.com",
      password: hashPassword("admin123"),
      role: "admin",
    },
  });

  // Create categories
  const categories = [
    { name: "Action", nameUk: "Бойовики", slug: "action" },
    { name: "Comedy", nameUk: "Комедії", slug: "comedy" },
    { name: "Drama", nameUk: "Драми", slug: "drama" },
    { name: "Horror", nameUk: "Жахи", slug: "horror" },
    { name: "Sci-Fi", nameUk: "Фантастика", slug: "sci-fi" },
    { name: "Animation", nameUk: "Анімація", slug: "animation" },
    { name: "Documentary", nameUk: "Документальні", slug: "documentary" },
    { name: "Romance", nameUk: "Мелодрами", slug: "romance" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Sample movies
  const movies = [
    {
      tmdbId: 299534,
      title: "Avengers: Endgame",
      titleUk: "Месники: Завершення",
      description: "The grave course of events set in motion by Thanos...",
      descriptionUk: "Після руйнівних подій Нескінченної війни всесвіт перебуває в руїнах. Месники повинні зібратися разом, щоб скасувати дії Таноса.",
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      genre: "action",
      year: 2019,
      rating: 8.4,
      duration: 181,
      isNew: false,
      isFeatured: true,
    },
    {
      tmdbId: 19995,
      title: "Avatar",
      titleUk: "Аватар",
      description: "In the 22nd century, a paraplegic Marine...",
      descriptionUk: "У 22 столітті паралізований морський піхотинець відправляється на місяць Пандора, де колонізатори видобувають мінерал. Він закохується в корінну жительку.",
      posterUrl: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
      genre: "sci-fi",
      year: 2009,
      rating: 7.8,
      duration: 162,
      isNew: false,
      isFeatured: false,
    },
    {
      tmdbId: 550,
      title: "Fight Club",
      titleUk: "Бійцівський клуб",
      description: "An insomniac office worker and a devil-may-care soapmaker...",
      descriptionUk: "Безсонний офісний працівник та безтурботний виробник мила формують підпільний бійцівський клуб, який переростає у щось більше.",
      posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
      genre: "drama",
      year: 1999,
      rating: 8.8,
      duration: 139,
      isNew: false,
      isFeatured: false,
    },
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { tmdbId: movie.tmdbId },
      update: {},
      create: movie,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("👤 Admin: admin@ukrflix.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
