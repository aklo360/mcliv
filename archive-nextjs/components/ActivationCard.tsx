export default function ActivationCard({ title, image, blurb }: { title: string; image: string; blurb: string }) {
  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="aspect-[4/3] bg-neutral-100">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-neutral-700 mt-1">{blurb}</p>
      </div>
    </article>
  );
}

