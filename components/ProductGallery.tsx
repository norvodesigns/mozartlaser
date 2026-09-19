'use client';

import Image from 'next/image';
import { useState } from 'react';
import { isVideo } from '@/lib/products';

export function ProductGallery({
  images,
  name,
  material,
}: {
  images: string[];
  name: string;
  material: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const woodName = material.split('·')[0]?.trim().toLowerCase() ?? 'wood';

  if (!current) {
    return <div className="product__stage" aria-hidden="true" />;
  }

  return (
    <div className="product__gallery">
      <div className="product__stage">
        {isVideo(current) ? (
          <video src={current} controls playsInline preload="metadata" />
        ) : (
          <Image
            src={current}
            alt={`${name}, engraved in ${woodName}`}
            width={1200}
            height={1200}
            sizes="(max-width: 900px) 100vw, 580px"
            priority
          />
        )}
      </div>

      {images.length > 1 ? (
        <div className="product__thumbs" role="group" aria-label={`${name} views`}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className="product__thumb"
              aria-current={index === active}
              aria-label={`View ${index + 1} of ${images.length}`}
              onClick={() => setActive(index)}
            >
              {isVideo(src) ? (
                <video src={src} muted playsInline preload="metadata" />
              ) : (
                <Image src={src} alt="" width={144} height={144} />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
