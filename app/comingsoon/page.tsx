export const metadata = {
  title: "Coming Soon · MCLIV Studio",
  description: "NYC-based Functional Art & Multidisciplinary Design Studio",
};

import Footer from "@/components/Footer";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      {/* Upper-left header with logo + subtitle */}
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/icons/logo.svg" alt="MCLIV" className="mx-auto h-16 w-auto" />
          <p className="mt-3 text-base text-neutral-700">
            NYC-based Functional Art &amp; Multidisciplinary Design Studio
          </p>
        </div>
      </header>

      {/* Centered Coming Soon content */}
      <div className="flex-1 grid place-items-center px-6">
        <section className="w-full max-w-lg text-center">
          <img src="/icons/icon.svg" alt="" aria-hidden className="spin mx-auto h-12 w-12 mb-5" />
          <h1 className="h2 mb-2">Coming Soon</h1>
          <p className="text-sm text-neutral-700 mb-6">
            Our first release is coming shortly, please join our mailing list to stay up to date with our studio's releases and activations.
          </p>
          <form action="#" className="flex items-center justify-center gap-2">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="w-full max-w-xs border border-black/15 rounded-md px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center rounded-md border border-black/80 bg-black text-white px-4 py-2 text-sm hover:bg-white hover:text-black transition"
            >
              Join List
            </button>
          </form>
        </section>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </main>
  );
}
