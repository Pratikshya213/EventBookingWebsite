"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import FeaturedEvents from "@/components/FeaturedEvents";

const categories = [
  { name: "Music", emoji: "♫" },
  { name: "Arts", emoji: "✦" },
  { name: "Business", emoji: "↗" },
  { name: "Food", emoji: "♡" },
];

export default function HomePage() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <HomeHero />
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6"><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Find your vibe</p><h2 className="mt-2 text-3xl font-bold">Explore categories</h2></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link href={`/events?category=${encodeURIComponent(category.name)}`} className="flex min-h-28 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-700">{category.emoji}</span>
                <span className="font-semibold">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <FeaturedEvents />
    </motion.main>
  );
}
