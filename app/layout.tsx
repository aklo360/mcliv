import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "MCLIV Studio", template: "%s | MCLIV" },
  description: "Minimal, architectural UI with Wind/Water calmness.",
  openGraph: {
    title: "MCLIV Studio",
    description: "Design-forward, hyper contemporary Next.js experience.",
    url: "/",
    siteName: "MCLIV Studio",
    images: ["/images/og/cover.jpg"],
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: GFS Didot (display) + Inter (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=GFS+Didot:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
