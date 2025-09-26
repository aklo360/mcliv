export default function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={(compact ? "mt-0" : "mt-24") + " border-t border-black/5"}>
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:justify-between md:text-left text-xs md:text-sm text-neutral-500">
        <div>
          <address className="meta not-italic text-xs md:text-sm">
            © MCLIV Studio, 3 World Trade Center, 69th Fl, 175 Greenwich St, New York, NY 10007
          </address>
        </div>
      </div>
    </footer>
  );
}
