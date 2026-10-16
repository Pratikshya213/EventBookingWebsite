"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../lib/auth";

export default function SignUpForm() {
  const inputClass =
    "mt-2 w-full rounded-[13px] border border-[#e6dedb] bg-white px-5 py-3.5 text-sm text-[#49302f] outline-none transition placeholder:text-[#a99b9b] focus:border-[#df6c5c] focus:ring-2 focus:ring-[#df6c5c]/15";

  const router = useRouter();
  const { setUser } = useAuth();

  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (info.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (info.password !== info.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser(
        info.name.trim(),
        info.email.trim(),
        info.password,
        info.confirmPassword,
      );

      setUser({
        id: String(user.id),
        name: user.name,
        email: user.email,
      });

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#fff8eb] px-5 py-6 sm:px-8 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Left: Concert image */}
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

        {/* Right: Signup form */}
        <section className="flex items-center justify-center py-5 lg:py-8">
          <div className="w-full max-w-[540px]">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#884b49]">
              Join the community
            </p>

            <h1 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-[#49302f] sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#805c58]">
              Save your favorite events and keep every booking in one place.
            </p>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-[#49302f]"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  className={inputClass}
                  value={info.name}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

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
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={inputClass}
                  value={info.password}
                  onChange={(e) =>
                    setInfo({ ...info, password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-[#49302f]"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={inputClass}
                  value={info.confirmPassword}
                  onChange={(e) =>
                    setInfo({ ...info, confirmPassword: e.target.value })
                  }
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
                className="w-full rounded-[13px] bg-[#e56e5e] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d85f50] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#805c58]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#c85b4e] underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-[#a18a83]">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
