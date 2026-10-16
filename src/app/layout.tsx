import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "VYBE",
  description: "Discover, book, and experience events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
