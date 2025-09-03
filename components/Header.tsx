"use client";
import Link from "next/link";

export default function Header({ showLogo = true, transparent = false }: { showLogo?: boolean; transparent?: boolean }) {
  return (
    <header className={(transparent ? "fixed" : "sticky") + " top-0 z-50 w-full " + (transparent ? "bg-transparent" : "backdrop-blur bg-white/60 border-b border-black/5") }>
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {showLogo ? (
          <Link href="/" className="flex items-center gap-3">
            <img src="/icons/logo.svg" alt="MCLIV" className="h-6 w-auto" />
            <span className="sr-only">MCLIV Studio</span>
          </Link>
        ) : (
          <span aria-hidden className="h-6" />
        )}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#about" className="hover:underline">About</Link>
          <Link href="/#contact" className="hover:underline">Contact</Link>
          <Link href="/#releases" className="hover:underline">Releases</Link>
          <Link href="/#activations" className="hover:underline">Activations</Link>
          <Link href="/#multimedia" className="hover:underline">Multimedia</Link>
        </nav>
      </div>
    </header>
  );
}
