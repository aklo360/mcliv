import EditionStamp from "@/components/EditionStamp";

export default function ReleaseCard({
  title,
  image,
  status,
  editionNumber,
}: {
  title: string;
  image: string;
  status: "Available" | "Sold Out" | "Upcoming";
  editionNumber?: number;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="aspect-[4/3] bg-neutral-100">
        <img src={image} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.01]" />
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <EditionStamp number={editionNumber ?? 1} />
        </div>
        <span className="text-xs px-2 py-1 rounded-full border border-black/10">{status}</span>
      </div>
    </article>
  );
}
