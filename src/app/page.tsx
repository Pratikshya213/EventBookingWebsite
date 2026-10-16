import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHero from "@/components/HomeHero";
import FeaturedEvents from "@/components/FeaturedEvents";
import { routes } from "@/lib/routes";

const categories = [
  { name: "Music", icon: "♪", note: "Concerts & live shows" },
  { name: "Arts", icon: "✥", note: "Exhibitions & workshops" },
  { name: "Business", icon: "↗", note: "Talks & conferences" },
  { name: "Food", icon: "○", note: "Markets & tastings" },
];

const marqueeText = ["LIVE MUSIC", "WORKSHOPS", "TALKS", "FOOD"].join("  •  ") + "  •  ";

export default function Home() {
  return (
    <main>
      <HomeHero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>{marqueeText.repeat(4)}</span>
          <span>{marqueeText.repeat(4)}</span>
        </div>
      </div>

      <section className="band-white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Explore your interests</div>
              <h2>Something for every mood</h2>
            </div>
            <Link href={routes.events} className="section-link">View all events <ArrowRight size={13} /></Link>
          </div>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <Link
                key={c.name}
                href={`${routes.events}?category=${encodeURIComponent(c.name)}`}
                className={`cat-card${i % 2 === 1 ? " alt" : ""}`}
              >
                <span className="cat-icon" aria-hidden="true">{c.icon}</span>
                <div>
                  <strong>{c.name}</strong>
                  <div className="cat-row"><span>{c.note}</span><ArrowRight size={11} /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedEvents />

      <div className="container">
        <section className="cta" id="about">
          <div>
            <small>Never miss a good plan</small>
            <h2>Your next favorite memory is nearby.</h2>
          </div>
          <Link href={routes.events} className="btn">Explore all events <ArrowRight size={12} /></Link>
        </section>
      </div>
    </main>
  );
}