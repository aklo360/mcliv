import {useState} from 'react';
import type {ActivationImage} from '~/lib/activations';

export function MediaCarousel({
  items,
  title,
}: {
  items: ActivationImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const safe = Math.min(index, items.length - 1);

  return (
    <div className="detail-carousel">
      <div className="detail-carousel-frame">
        {items.map((asset, i) => (
          <figure
            key={asset.id}
            className={`detail-carousel-slide${i === safe ? ' is-active' : ''}`}
            aria-hidden={i !== safe}
          >
            {asset.type === 'video' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption -- recap clip has no caption track available
              <video controls playsInline preload="metadata">
                <source src={asset.url} type="video/webm" />
              </video>
            ) : (
              <img src={asset.url} alt={asset.altText} loading={i === 0 ? 'eager' : 'lazy'} />
            )}
          </figure>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="detail-carousel-foot">
          <div
            className="detail-carousel-dots"
            role="tablist"
            aria-label={`${title} media`}
          >
            {items.map((asset, i) => (
              <button
                key={asset.id}
                type="button"
                className={`dot${i === safe ? ' active' : ''}`}
                aria-label={`Show media ${i + 1} of ${items.length}`}
                aria-pressed={i === safe}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <span className="detail-carousel-counter mono">
            {String(safe + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>
      ) : null}
    </div>
  );
}
