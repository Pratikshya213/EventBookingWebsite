import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Afterglow — Good nights, found",
  description: "Small, unforgettable things to do in the city.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><SiteHeader/>{children}<footer className="footer"><a className="brand" href="/">afterglow<span>®</span></a><span>Good things happen after 6.</span><span>© 2025 Afterglow Studio</span></footer></body>
    </html>
  );
}
