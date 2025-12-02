export default function MultimediaCard({ category, image }: { category: "Web" | "Photo" | "Video"; image: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="aspect-[4/3] bg-neutral-100">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 text-xs text-neutral-700">{category}</figcaption>
    </figure>
  );
}

