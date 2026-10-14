import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import FeaturedEvents from "@/components/FeaturedEvents";

export default function Home() {
  return <main><HomeHero/><FeaturedEvents/><section className="manifesto" id="about"><div className="manifesto-mark">✳</div><p>We believe the best nights<br/>aren’t <em>planned to perfection.</em></p><Link href="/booking">Just get out there →</Link></section></main>;
}
