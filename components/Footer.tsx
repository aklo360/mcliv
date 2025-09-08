export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-neutral-500">
        <div>
          <address className="meta not-italic">
            © MCLIV Studio, 3 World Trade Center, 69th Fl, 175 Greenwich St, New York, NY 10007
          </address>
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@mcliv.studio" className="inline-flex items-center gap-2 hover:line-through">
            <svg aria-hidden viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-4 stroke-current">
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" strokeWidth="1.4"/>
              <path d="m22 8-9.2 6.9a2 2 0 0 1-1.6 0L2 8" strokeWidth="1.4"/>
            </svg>
            hello@mcliv.studio
          </a>
          <span aria-hidden="true" className="text-neutral-400">·</span>
          <a href="https://docs.google.com/presentation/d/16HrcGkgCA5fulRyaRYjnVaqGJOw6euo9b6vj-aLTArY/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:line-through">Pitch Deck</a>
        </div>
      </div>
    </footer>
  );
}
