import type { Metadata } from "next";
import "./globals.css";
import { Inter, GFS_Didot } from "next/font/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "MCLIV Studio", template: "%s | MCLIV" },
  description: "A Creative Studio.",
  openGraph: {
    title: "MCLIV Studio",
    description: "A Creative Studio.",
    url: "/",
    siteName: "MCLIV Studio",
    images: [""],
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  twitter: { card: "summary_large_image" },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const gfsDidot = GFS_Didot({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-gfsdidot",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${gfsDidot.variable}`}>
      <body className="antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
