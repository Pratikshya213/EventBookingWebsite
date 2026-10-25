"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const inputClass =
    "mt-2 w-full rounded-[13px] border border-[#e6dedb] bg-white px-5 py-3.5 text-sm text-[#49302f] outline-none transition placeholder:text-[#a99b9b] focus:border-[#df6c5c] focus:ring-2 focus:ring-[#df6c5c]/15";

  const router = useRouter();
  const { setUser } = useAuth();

  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (info.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(info.email.trim(), info.password);

      setUser({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role === "admin" ? "admin" : "user",
      });

      router.push(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8eb] px-5 py-6 sm:px-8 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="relative h-[320px] overflow-hidden rounded-[24px] sm:h-[400px] lg:h-[640px] lg:self-center">
          <Image
            src="/images/band-playing.avif"
            alt="Band performing live at a concert"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </section>

        <section className="flex items-center justify-center py-5 lg:py-8">
          <div className="w-full max-w-[540px]">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#884b49]">
              Welcome Back
            </p>

            <h1 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-[#49302f] sm:text-3xl">
              Log in to continue
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#805c58]">
              Your event is waiting. Log in to complete your booking.
            </p>

            <p className="mt-2 text-xs text-[#805c58]">
              Demo admin: <strong>admin@happen.com</strong> / <strong>admin1234</strong>
            </p>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#49302f]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  className={inputClass}
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#49302f]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={inputClass}
                  value={info.password}
                  onChange={(e) =>
                    setInfo({ ...info, password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[13px] bg-[#e56e5e] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(190,86,73,0.12)] transition hover:bg-[#d85f50] focus:outline-none focus:ring-4 focus:ring-[#e56e5e]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#805c58]">
              New to Vybe?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#c85b4e] underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
