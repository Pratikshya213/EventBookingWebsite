import Link from "next/link";
import { routes } from "@/lib/routes";

export default function FavoritesPage() {
  return (
    <main className="page">
      <div className="container container-sm empty">
        <div className="eyebrow">Saved for later</div>
        <h1 className="page-title">Your favorites</h1>
        <p>Favorite events you save will appear here.</p>
        <Link href={routes.events} className="btn btn-primary">Browse events</Link>
      </div>
    </main>
  );
}
