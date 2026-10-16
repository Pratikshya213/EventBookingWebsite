"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const routes = {
  home: "/",
  events: "/events",
  favorites: "/favorites",
  myBookings: "/my-bookings",
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const signedIn = Boolean(user);

  const links = [
    { href: routes.events, label: "Browse events" },
    { href: routes.favorites, label: "Favorites" },
    ...(signedIn ? [{ href: routes.myBookings, label: "My bookings" }] : []),
  ];

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href={routes.home} className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark"><i /></span>
          happen.
        </Link>

        <nav className="nav-links" aria-label="Main">
          {links.map((l) => (
            <Link key={l.label} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {signedIn ? (
            <>
              <span className="greeting">Hi, {user?.name.split(" ")[0]}</span>
              <Link href={routes.home} className="btn btn-outline" onClick={logout}>Log out</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="link-plain">Log in</Link>
              <Link href="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {signedIn ? (
            <Link href={routes.home} className="btn btn-outline" onClick={() => { logout(); setOpen(false); }}>Log out</Link>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" className="btn btn-primary" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
