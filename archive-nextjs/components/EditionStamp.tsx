export default function EditionStamp({ number = 1 }: { number?: number }) {
  const num = String(number).padStart(3, "0");
  return (
    <span className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-neutral-800">
      <img src="/icons/icon.svg" alt="MCLIV" className="h-4 w-4" />
      MCLIV / 1154 / No. {num}
    </span>
  );
}
