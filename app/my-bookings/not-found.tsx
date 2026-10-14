import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Error 404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Lost your way?</h1>
      <p className="mt-4 max-w-md text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <Link href="/" className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95">Back to home</Link>
    </main>
  );
}
