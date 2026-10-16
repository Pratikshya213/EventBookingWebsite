import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <div className="eyebrow">Error 404</div>
        <h1>Lost?</h1>
        <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link className="btn btn-primary" href="/">Back to home</Link>
      </div>
    </main>
  );
}