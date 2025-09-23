export const metadata = {
  title: "Coming Soon · MCLIV Studio",
  description: "A Creative Studio",
};

import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

export default function ComingSoonHome() {
  return (
    <main className="grid grid-rows-[auto_1fr_auto] h-[100dvh] overflow-hidden bg-white text-black">
      {/* Header */}
      <header className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/icons/logov2.svg" alt="MCLIV" className="mx-auto h-12 sm:h-16 w-auto" />
        </div>
      </header>

      {/* Centered Coming Soon content */}
      <div className="min-h-0 grid place-items-center px-6">
        <section className="w-full max-w-lg text-center">
          <img src="/icons/icon.svg" alt="" aria-hidden className="spin mx-auto h-12 w-12 mb-5" />
          <h1 className="h2 mb-2">Coming Soon</h1>
          <p className="text-sm text-neutral-700 mb-6 mx-auto max-w-[90vw] sm:max-w-none">
            Join our mailing list to be first to know about our studio's limited releases and activations.
          </p>
          <NewsletterForm />
        </section>
      </div>

      {/* Footer pinned within viewport */}
      <Footer compact />
    </main>
  );
}
