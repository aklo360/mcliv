export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-10 flex items-center justify-between text-sm text-neutral-600">
        <p className="meta">© MCLIV Studio</p>
        <div className="flex items-center gap-6">
          <a href="mailto:hello@mcliv.studio" className="hover:underline">hello@mcliv.studio</a>
          <a href="#" className="hover:underline">Press Kit</a>
        </div>
      </div>
    </footer>
  );
}
