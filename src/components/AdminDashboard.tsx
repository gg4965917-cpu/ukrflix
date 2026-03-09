"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Film, Plus, Search, Trash2, Edit,
  LogOut, RefreshCw, Download, Eye, EyeOff, Star,
  CheckCircle, XCircle, Loader2, CloudDownload, Home,
  ChevronRight, TrendingUp, Zap,
} from "lucide-react";
import type { Movie } from "@/types";
import { GENRES } from "@/types";

interface Stats {
  totalMovies: number;
  publishedMovies: number;
  newMovies: number;
  featuredMovies: number;
}

interface Props {
  stats: Stats;
  recentMovies: Movie[];
}

type Tab = "dashboard" | "movies" | "add" | "sync";

const EMPTY_FORM = {
  title: "", titleUk: "", description: "", descriptionUk: "",
  posterUrl: "", backdropUrl: "", trailerUrl: "", videoUrl: "",
  genre: "action", year: new Date().getFullYear(), rating: 0,
  duration: 0, isNew: false, isFeatured: false, isPublished: true,
};

export function AdminDashboard({ stats, recentMovies }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Sync state
  const [syncSearch, setSyncSearch] = useState("");
  const [syncResults, setSyncResults] = useState<TmdbResult[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const showMsg = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const loadMovies = useCallback(async () => {
    setLoadingMovies(true);
    const res = await fetch("/api/admin/movies");
    const data = await res.json();
    setMovies(data);
    setLoadingMovies(false);
  }, []);

  useEffect(() => {
    if (tab === "movies") loadMovies();
  }, [tab, loadMovies]);

  const filtered = movies.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.titleUk?.toLowerCase().includes(q) ?? false)
    );
  });

  // CRUD
  const saveMovie = async () => {
    setSaving(true);
    try {
      if (editId) {
        await fetch("/api/admin/movies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
        showMsg("ok", "Фільм оновлено!");
      } else {
        await fetch("/api/admin/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showMsg("ok", "Фільм додано!");
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setTab("movies");
      loadMovies();
    } catch {
      showMsg("err", "Помилка збереження");
    }
    setSaving(false);
  };

  const deleteMovie = async (id: number) => {
    if (!confirm("Видалити фільм?")) return;
    await fetch(`/api/admin/movies?id=${id}`, { method: "DELETE" });
    setMovies((prev) => prev.filter((m) => m.id !== id));
    showMsg("ok", "Фільм видалено");
  };

  const editMovie = (m: Movie) => {
    setForm({
      title: m.title, titleUk: m.titleUk ?? "",
      description: m.description, descriptionUk: m.descriptionUk ?? "",
      posterUrl: m.posterUrl, backdropUrl: m.backdropUrl ?? "",
      trailerUrl: m.trailerUrl ?? "", videoUrl: m.videoUrl ?? "",
      genre: m.genre, year: m.year, rating: m.rating,
      duration: m.duration ?? 0, isNew: m.isNew,
      isFeatured: m.isFeatured, isPublished: m.isPublished,
    });
    setEditId(m.id);
    setTab("add");
  };

  // TMDB sync
  const searchTmdb = async () => {
    if (!syncSearch.trim()) return;
    setSyncLoading(true);
    const res = await fetch(`/api/admin/sync?action=search&q=${encodeURIComponent(syncSearch)}`);
    const data = await res.json();
    if (data.error) {
      showMsg("err", data.error);
      setSyncResults([]);
    } else {
      setSyncResults(data);
    }
    setSyncLoading(false);
  };

  const importFromTmdb = async (tmdbId: number) => {
    setSyncing(tmdbId);
    const res = await fetch("/api/admin/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tmdbId }),
    });
    const data = await res.json();
    if (data.error && res.status !== 409) {
      showMsg("err", data.error);
    } else if (res.status === 409) {
      showMsg("err", "Цей фільм вже є в базі");
    } else {
      showMsg("ok", `"${data.movie.title}" імпортовано!`);
    }
    setSyncing(null);
  };

  const bulkImport = async () => {
    setBulkLoading(true);
    const res = await fetch("/api/admin/sync?action=bulk", { method: "POST" });
    const data = await res.json();
    if (data.error) {
      showMsg("err", data.error);
    } else {
      showMsg("ok", `Імпортовано: ${data.imported}, пропущено: ${data.skipped}`);
    }
    setBulkLoading(false);
  };

  const navItems = [
    { id: "dashboard" as Tab, icon: LayoutDashboard, label: "Огляд" },
    { id: "movies" as Tab, icon: Film, label: "Фільми" },
    { id: "add" as Tab, icon: Plus, label: "Додати фільм" },
    { id: "sync" as Tab, icon: CloudDownload, label: "Синхронізація TMDB" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-slide-up
          ${msg.type === "ok" ? "bg-green-900/90 border border-green-600 text-green-300" : "bg-red-900/90 border border-red-600 text-red-300"}`}>
          {msg.type === "ok" ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-black text-red-600">УКР</span>
            <span className="text-xl font-black text-white">ФЛІКС</span>
          </Link>
          <p className="text-zinc-600 text-xs mt-1">Адмін-панель</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id === "add") { setForm(EMPTY_FORM); setEditId(null); } }}
              className={`admin-nav-item w-full ${tab === id ? "active" : ""}`}
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link href="/" className="admin-nav-item w-full flex">
            <Home size={18} />
            <span className="text-sm">На сайт</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="admin-nav-item w-full text-red-500 hover:text-red-400 hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span className="text-sm">Вийти</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-6 overflow-auto">
        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Огляд</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Всього фільмів", value: stats.totalMovies, icon: Film, color: "text-blue-400" },
                { label: "Опубліковано", value: stats.publishedMovies, icon: Eye, color: "text-green-400" },
                { label: "Новинки", value: stats.newMovies, icon: TrendingUp, color: "text-yellow-400" },
                { label: "На головній", value: stats.featuredMovies, icon: Star, color: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-sm">{s.label}</span>
                    <s.icon size={20} className={s.color} />
                  </div>
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Останні додані фільми</h3>
              <div className="space-y-3">
                {recentMovies.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                    <div className="w-10 h-14 rounded overflow-hidden shrink-0 relative">
                      <Image src={m.posterUrl} alt={m.title} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{m.titleUk || m.title}</p>
                      <p className="text-zinc-500 text-xs">{m.year} • {GENRES[m.genre] ?? m.genre}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={12} className="fill-yellow-400" />
                      {m.rating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOVIES LIST */}
        {tab === "movies" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Всі фільми</h2>
              <div className="flex gap-2">
                <button onClick={loadMovies} className="btn-gray text-sm px-4 py-2">
                  <RefreshCw size={16} />
                  Оновити
                </button>
                <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setTab("add"); }} className="btn-red text-sm px-4 py-2">
                  <Plus size={16} />
                  Додати
                </button>
              </div>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук фільмів..."
                className="ukrflix-input pl-9"
              />
            </div>

            {loadingMovies ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-red-500" />
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                      <th className="text-left px-4 py-3">Фільм</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Жанр</th>
                      <th className="text-left px-4 py-3 hidden lg:table-cell">Рік</th>
                      <th className="text-left px-4 py-3 hidden lg:table-cell">Рейтинг</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-right px-4 py-3">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filtered.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-11 rounded overflow-hidden relative shrink-0">
                              <Image src={m.posterUrl} alt={m.title} fill className="object-cover" sizes="32px" />
                            </div>
                            <div>
                              <p className="text-white font-medium truncate max-w-[180px]">
                                {m.titleUk || m.title}
                              </p>
                              {m.titleUk && <p className="text-zinc-600 text-xs truncate max-w-[180px]">{m.title}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">
                          {GENRES[m.genre] ?? m.genre}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">{m.year}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star size={12} className="fill-yellow-400" />
                            {m.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs px-2 py-0.5 rounded w-fit ${m.isPublished ? "bg-green-900/50 text-green-400" : "bg-zinc-800 text-zinc-500"}`}>
                              {m.isPublished ? "Опубліковано" : "Приховано"}
                            </span>
                            {m.isNew && <span className="text-xs px-2 py-0.5 rounded w-fit bg-red-900/50 text-red-400">Нове</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/movies/${m.id}`} target="_blank">
                              <button className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-700 transition-colors" title="Переглянути">
                                <Eye size={15} />
                              </button>
                            </Link>
                            <button onClick={() => editMovie(m)} className="p-1.5 text-zinc-500 hover:text-blue-400 rounded hover:bg-zinc-700 transition-colors" title="Редагувати">
                              <Edit size={15} />
                            </button>
                            <button onClick={() => deleteMovie(m.id)} className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-700 transition-colors" title="Видалити">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-zinc-600">
                    <Film size={40} className="mx-auto mb-3 opacity-50" />
                    <p>Фільмів не знайдено</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT FORM */}
        {tab === "add" && (
          <div className="animate-fade-in max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setTab("movies")} className="text-zinc-500 hover:text-white">
                Фільми
              </button>
              <ChevronRight size={16} className="text-zinc-600" />
              <h2 className="text-2xl font-bold text-white">
                {editId ? "Редагувати фільм" : "Додати фільм"}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Назва (оригінал) *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="ukrflix-input" placeholder="The Dark Knight" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Назва українською</label>
                  <input value={form.titleUk} onChange={(e) => setForm({ ...form, titleUk: e.target.value })}
                    className="ukrflix-input" placeholder="Темний лицар" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Опис (оригінал) *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="ukrflix-input min-h-[80px] resize-y" placeholder="Description..." />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Опис українською</label>
                <textarea value={form.descriptionUk} onChange={(e) => setForm({ ...form, descriptionUk: e.target.value })}
                  className="ukrflix-input min-h-[80px] resize-y" placeholder="Опис фільму..." />
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">URL постера *</label>
                <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                  className="ukrflix-input" placeholder="https://image.tmdb.org/t/p/w500/..." />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">URL фонового зображення</label>
                <input value={form.backdropUrl} onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
                  className="ukrflix-input" placeholder="https://image.tmdb.org/t/p/original/..." />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">URL трейлера (YouTube)</label>
                <input value={form.trailerUrl} onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
                  className="ukrflix-input" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">URL відео (пряме посилання)</label>
                <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="ukrflix-input" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Жанр</label>
                  <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="ukrflix-input">
                    {Object.entries(GENRES).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Рік</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="ukrflix-input" min={1900} max={2030} />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Рейтинг</label>
                  <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                    className="ukrflix-input" min={0} max={10} step={0.1} />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-1.5">Тривалість (хв)</label>
                  <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="ukrflix-input" min={0} />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { key: "isNew", label: "Новинка" },
                  { key: "isFeatured", label: "На головній (герой)" },
                  { key: "isPublished", label: "Опубліковано" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="w-4 h-4 accent-red-600" />
                    <span className="text-zinc-300 text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveMovie} disabled={saving || !form.title || !form.posterUrl}
                  className="btn-red disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {editId ? "Зберегти зміни" : "Додати фільм"}
                </button>
                <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); }} className="btn-gray">
                  Скинути
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TMDB SYNC */}
        {tab === "sync" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">Синхронізація з TMDB</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Автоматично імпортуйте фільми з бази даних The Movie Database (TMDB)
            </p>

            {/* Bulk import */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400" />
                    Автоімпорт популярних фільмів
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    Одним кліком імпортуйте 20 найпопулярніших фільмів з TMDB (потрібен TMDB_API_KEY)
                  </p>
                </div>
                <button onClick={bulkImport} disabled={bulkLoading} className="btn-red shrink-0">
                  {bulkLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {bulkLoading ? "Імпорт..." : "Імпортувати 20 фільмів"}
                </button>
              </div>
            </div>

            {/* Search & import */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Search size={18} className="text-blue-400" />
                Пошук та імпорт конкретного фільму
              </h3>
              <div className="flex gap-2 mb-5">
                <input
                  value={syncSearch}
                  onChange={(e) => setSyncSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchTmdb()}
                  placeholder="Введіть назву фільму..."
                  className="ukrflix-input flex-1"
                />
                <button onClick={searchTmdb} disabled={syncLoading} className="btn-red px-5">
                  {syncLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </div>

              {syncResults.length > 0 && (
                <div className="space-y-3">
                  {syncResults.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                      {r.poster_path ? (
                        <div className="w-10 h-14 rounded overflow-hidden relative shrink-0">
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                            alt={r.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-14 rounded bg-zinc-700 flex items-center justify-center shrink-0">
                          <Film size={16} className="text-zinc-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{r.title}</p>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                          <span>{r.release_date?.substring(0, 4)}</span>
                          <span className="flex items-center gap-0.5">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            {r.vote_average?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => importFromTmdb(r.id)}
                        disabled={syncing === r.id}
                        className="btn-red text-xs px-3 py-1.5"
                      >
                        {syncing === r.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Імпорт
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {syncResults.length === 0 && syncSearch && !syncLoading && (
                <p className="text-center text-zinc-600 py-8">Нічого не знайдено</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface TmdbResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}
