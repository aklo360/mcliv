import Sculpture from "@/components/Sculpture";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-x-hidden overflow-y-hidden">
      <div className="absolute inset-0 z-0">
        <Sculpture />
      </div>
      <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2 pointer-events-none">
        {/* Left column: logo + body text */}
        <div className="flex flex-col justify-between ml-24 p-6 md:p-12 bg-transparent">
          <span />
          <div>
            <img src="/icons/logo.svg" alt="MCLIV" className="h-16 md:h-20 w-auto" />
            <p className="mt-6 text-xl text-neutral-700 max-w-xl pl-2">
              NYC-based Functional Art &
              <br className="sm:hidden" />
              {" "}Multidisciplinary Design Studio
            </p>
          </div>
          <span />
        </div>
        {/* Right column intentionally empty; sculpture sits as background */}
        <div />
      </div>
    </section>
  );
}
