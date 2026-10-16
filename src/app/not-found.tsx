import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <div className="eyebrow">Wrong turn, good story</div>
        <h1>404</h1>
        <p>This page slipped out for the night.</p>
        <Link className="btn btn-primary" href="/">Back to the good stuff</Link>
      </div>
    </main>
  );
}