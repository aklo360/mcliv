"use client";

import {useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';

type CarouselImage = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductCarousel({
  images,
  title,
  sizes = '(min-width: 960px) 50vw, 90vw',
  className,
}: {
  images: CarouselImage[];
  title: string;
  sizes?: string;
  className?: string;
}) {
  const safeImages = useMemo(
    () => images.filter((img) => !!img?.url),
    [images],
  );
  const [index, setIndex] = useState(0);
  const current = safeImages[index] ?? safeImages[0];

  if (!current) return null;

  const aspectRatio =
    current.width && current.height
      ? `${current.width}/${current.height}`
      : "4/5";

  const next = () => {
    if (!safeImages.length) return;
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    if (!safeImages.length) return;
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className={['product-carousel', className].filter(Boolean).join(' ')}>
      <div className="carousel-frame" style={{aspectRatio}}>
        <Image
          data={current}
          sizes={sizes}
          className="carousel-image"
        />
        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              className="carousel-control left"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-control right"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
            <div
              className="carousel-dots"
              role="tablist"
              aria-label="Product images"
            >
              {safeImages.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={`dot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${safeImages.length}`}
                  aria-pressed={i === index}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
