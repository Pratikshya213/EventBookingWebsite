import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <div className="eyebrow">Wrong turn, good story</div>

        <h1>404</h1>

        <p>
          This event slipped out for the night. It may have been removed or the
          link might be incorrect.
        </p>

        <Link className="btn btn-primary" href="/events">
          Explore Events
        </Link>
      </div>
    </main>
  );
}
