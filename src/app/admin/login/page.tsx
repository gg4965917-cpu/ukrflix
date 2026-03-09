"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Невірний email або пароль");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black inline">
            <span className="text-red-600">УКР</span>
            <span className="text-white">ФЛІКС</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Панель адміністратора</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Увійти</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ukrflix.com"
                  className="ukrflix-input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-1.5">Пароль</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ukrflix-input pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-red justify-center py-3 mt-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Вхід..." : "Увійти"}
            </button>
          </form>

          <p className="text-zinc-600 text-xs text-center mt-6">
            За замовчуванням: admin@ukrflix.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
