export const metadata = {
  title: "Coming Soon · MCLIV Studio",
  description: "NYC-based Functional Art & Multidisciplinary Design Studio",
};

import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

export default function ComingSoonHome() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Upper-left header with logo + subtitle */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <img src="/icons/logo.svg" alt="MCLIV" className="mx-auto h-16 w-auto" />
            <p className="mt-3 text-base text-neutral-700">
              NYC-based Functional Art &amp;
              <br className="sm:hidden" />
              {" "}Multidisciplinary Design Studio
            </p>
          </div>
        </header>

        {/* Centered Coming Soon content */}
        <div className="flex-1 grid place-items-center px-6">
          <section className="w-full max-w-lg text-center">
            <img src="/icons/icon.svg" alt="" aria-hidden className="spin mx-auto h-12 w-12 mb-5" />
            <h1 className="h2 mb-2">Coming Soon</h1>
            <p className="text-sm text-neutral-700 mb-6 mx-auto max-w-[26ch] sm:max-w-none">
              Our first drop is coming shortly, join our mailing list to be the first to know about our studio's limited releases and activations.
            </p>
            <NewsletterForm />
          </section>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </main>
  );
}
