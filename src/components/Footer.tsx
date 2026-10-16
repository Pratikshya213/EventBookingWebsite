import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white px-7 py-10 md:px-14 md:py-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-5">
          <Link href="/" className="text-xl no-underline text-[#49312D]">
            VYBE.
          </Link>
          <p className="text-sm text-[#795B55]">Good events. Better stories</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-4 md:gap-12">
          <Link
            href="/events"
            className="text-base text-[#49312D] transition-colors hover:text-[#A47768]"
          >
            Browse
          </Link>

          <Link
            href="/favorites"
            className="text-base text-[#49312D] transition-colors hover:text-[#A47768] "
          >
            Favorites
          </Link>

          <Link
            href="/my-bookings"
            className="text-base text-[#49312D] transition-colors hover:text-[#A47768] "
          >
            Account
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[#96736B] ">&copy; 2025 Vybe</p>
      </div>
    </footer>
  );
}
