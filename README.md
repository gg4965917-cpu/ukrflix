# 🎬 УкрФлікс — Сайт фільмів з Українською Озвучкою

![УкрФлікс](https://img.shields.io/badge/УкрФлікс-v1.0.0-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)

Повнофункціональний сайт для перегляду фільмів з **українською озвучкою**. Дизайн натхненний Netflix, з власною **адмін-панеллю** та інтеграцією **TMDB API** для автоматичного додавання фільмів.

---

## ✨ Можливості

- 🎥 **Netflix-дизайн** — адаптивний, темна тема, анімації
- 🇺🇦 **Повна локалізація** — назви та описи українською
- 🛡️ **Адмін-панель** — захищена, повне CRUD управління
- ⚡ **Авто-імпорт** — імпорт фільмів з TMDB одним кліком
- 🔍 **Пошук TMDB** — знайди будь-який фільм і додай миттєво
- 📱 **Мобільна версія** — адаптивний дизайн для всіх пристроїв
- 🎞️ **Жанри** — автоматична категоризація за жанрами
- 🏆 **Hero-секція** — виділений фільм на головній

---

## 🚀 Швидкий старт

### Крок 1 — Клонуй репозиторій

```bash
git clone https://github.com/YOUR_USERNAME/ukrflix.git
cd ukrflix
```

### Крок 2 — Встанови залежності

```bash
npm install
```

### Крок 3 — Налаштуй змінні середовища

```bash
cp .env.example .env
```

Відкрий `.env` і заповни:

```env
# База даних (SQLite — нічого не потрібно встановлювати)
DATABASE_URL="file:./dev.db"

# NextAuth — змін секрет на власний!
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="мій-секретний-ключ-змін-це"

# TMDB API (необхідно для авто-імпорту фільмів)
TMDB_API_KEY="твій_ключ_з_themoviedb.org"
```

### Крок 4 — Ініціалізуй базу даних

```bash
# Створити таблиці
npm run db:push

# Заповнити тестовими даними + admin аккаунт
npm run db:seed
```

### Крок 5 — Запусти проект

```bash
npm run dev
```

Відкрий → **http://localhost:3000**

---

## 🔑 Отримання TMDB API ключа (безкоштовно)

1. Зайди на [themoviedb.org](https://www.themoviedb.org/)
2. Зареєструйся (безкоштовно)
3. Перейди в **Профіль → Налаштування → API**
4. Натисни **"Запит на отримання API ключа"**
5. Обери "Особисте використання"
6. Скопіюй **API Key (v3 auth)** → встав у `TMDB_API_KEY`

---

## 👤 Вхід в адмін-панель

| URL | Дані |
|-----|------|
| `http://localhost:3000/admin` | - |
| Email | `admin@ukrflix.com` |
| Пароль | `admin123` |

> ⚠️ Обов'язково зміни пароль після першого входу!

---

## 📋 Адмін-панель — Інструкція

### 🎬 Додати фільм вручну

1. Увійди в `/admin`
2. Натисни **"Додати фільм"** у бічному меню
3. Заповни форму:
   - Назва (оригінал + українська)
   - Опис (оригінал + український)
   - URL постера та фону (з TMDB або будь-який)
   - URL трейлера (YouTube посилання)
   - URL відео (пряме посилання на фільм)
   - Жанр, рік, рейтинг, тривалість
4. Встанови прапорці: "Новинка", "На головній", "Опубліковано"
5. Натисни **"Додати фільм"** ✅

### ⚡ Автоматичний імпорт (TMDB)

1. Перейди до **"Синхронізація TMDB"**
2. Натисни **"Імпортувати 20 фільмів"** — одним кліком!
3. Всі 20 найпопулярніших фільмів додадуться автоматично

### 🔍 Пошук і імпорт конкретного фільму

1. Перейди до **"Синхронізація TMDB"**
2. Введи назву фільму в пошук
3. Натисни на **"Імпорт"** навпроти потрібного фільму
4. Фільм автоматично додається з постером, описом, трейлером

### ✏️ Редагування фільму

1. Перейди до **"Фільми"**
2. Натисни іконку ✏️ навпроти фільму
3. Зміни потрібні поля
4. Натисни **"Зберегти зміни"**

### 🗑️ Видалення фільму

1. Перейди до **"Фільми"**
2. Натисни іконку 🗑️ навпроти фільму
3. Підтвердь видалення

---

## 📁 Структура проекту

```
ukrflix/
├── prisma/
│   ├── schema.prisma      # Схема бази даних
│   └── seed.ts            # Початкові дані
├── src/
│   ├── app/
│   │   ├── page.tsx       # Головна сторінка
│   │   ├── layout.tsx     # Загальний layout
│   │   ├── globals.css    # Глобальні стилі
│   │   ├── admin/
│   │   │   ├── page.tsx   # Адмін-панель
│   │   │   └── login/     # Сторінка входу
│   │   ├── movies/[id]/   # Сторінка фільму
│   │   └── api/
│   │       ├── movies/    # API фільмів (публічний)
│   │       └── admin/
│   │           ├── movies/ # CRUD фільмів (захищений)
│   │           └── sync/   # TMDB синхронізація
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieRow.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── db.ts          # Prisma клієнт
│   │   ├── tmdb.ts        # TMDB API
│   │   └── auth.ts        # NextAuth конфіг
│   └── types/
│       └── index.ts       # TypeScript типи
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Деплой на Vercel (рекомендовано)

### Варіант А — GitHub + Vercel (найпростіше)

1. **Завантаж на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: УкрФлікс"
   git remote add origin https://github.com/YOUR_USERNAME/ukrflix.git
   git push -u origin main
   ```

2. **Деплой на Vercel:**
   - Зайди на [vercel.com](https://vercel.com) → "New Project"
   - Імпортуй репозиторій з GitHub
   - Додай змінні середовища в Vercel Dashboard:
     ```
     DATABASE_URL=file:./prod.db   # або PostgreSQL URL
     NEXTAUTH_SECRET=твій-секрет
     NEXTAUTH_URL=https://твій-домен.vercel.app
     TMDB_API_KEY=твій-ключ
     ```
   - Натисни "Deploy" 🚀

3. **Після деплою:**
   ```bash
   vercel env pull .env.local
   npx prisma db push
   npm run db:seed
   ```

### Варіант Б — PostgreSQL для продакшн

Замість SQLite для продакшн рекомендуємо PostgreSQL (Supabase — безкоштовно):

1. Зареєструйся на [supabase.com](https://supabase.com)
2. Створи проект → скопіюй Connection String
3. У `prisma/schema.prisma` зміни:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Встав PostgreSQL URL в `DATABASE_URL`

---

## 🛠️ Технології

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| Next.js | 14 | React фреймворк |
| TypeScript | 5 | Типізація |
| Tailwind CSS | 3 | Стилі |
| Prisma | 5 | ORM / база даних |
| NextAuth.js | 4 | Авторизація |
| TMDB API | v3 | Дані про фільми |
| SQLite | - | База даних (локально) |

---

## 📱 Скріншоти

| Сторінка | Опис |
|----------|------|
| `/` | Головна з hero-секцією та рядками жанрів |
| `/movies/[id]` | Детальна сторінка фільму |
| `/admin` | Адмін-панель (захищена) |
| `/admin/login` | Сторінка входу |

---

## 🔒 Безпека

- Адмін-панель захищена через NextAuth.js (JWT сесії)
- Всі API роути перевіряють авторизацію
- Паролі хешуються через SHA-256
- TMDB ключ зберігається тільки на сервері

---

## 📝 Ліцензія

MIT License — використовуй як хочеш!

---

## 🙏 Подяки

- Дизайн натхненний [netflx-web](https://github.com/sadmann7/netflx-web)
- Дані про фільми: [The Movie Database (TMDB)](https://www.themoviedb.org)
- Шрифти: Google Fonts (Roboto)

---

**Зроблено з ❤️ для України 🇺🇦**
