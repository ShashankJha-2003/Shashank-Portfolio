import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "../context/PortfolioContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shashank Jha — Software & Web Developer | Portfolio",
  description: "Official portfolio of Shashank Jha — Software & Web Developer specializing in React, Next.js, Three.js, GSAP, and Java DSA.",
  keywords: ["Shashank Jha", "Software Developer", "Web Developer", "React", "Next.js", "Three.js", "GSAP", "Java", "Portfolio", "Parul University", "PRISMIO"],
  authors: [{ name: "Shashank Jha" }],
  openGraph: {
    title: "Shashank Jha — Software & Web Developer | Portfolio",
    description: "Official portfolio of Shashank Jha — Software & Web Developer specializing in React, Next.js, Three.js, GSAP, and Java DSA.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#030607] text-[#f8fafc] font-sans antialiased selection:bg-[#4ade80]/20 selection:text-white">
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
