import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function SiteHeader(){return <header className="topbar"><Link className="brand" href="/">afterglow<span>®</span></Link><nav><Link href="/#discover">Discover</Link><Link href="/#about">Our story</Link><Link href="/my-bookings">My bookings</Link></nav><Link className="nav-cta" href="/booking">Plan a night <ArrowRight size={15}/></Link></header>}
