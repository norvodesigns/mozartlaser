'use client';

import Image from 'next/image';
import { useState } from 'react';
import { isVideo, type ProductImage } from '@/lib/products';

export function ProductGallery({
  images,
  name,
  wood,
}: {
  images: ProductImage[];
  name: string;
  wood: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return <div className="pdp__stage" aria-hidden="true" />;

  return (
    <div className="pdp__gallery">
      <div className="pdp__stage">
        {isVideo(current.src) ? (
          <video src={current.src} controls playsInline preload="metadata" />
        ) : (
          <Image
            src={current.src}
            alt={`${name}, engraved ${wood}`}
            width={current.width}
            height={current.height}
            sizes="(max-width: 900px) 92vw, 560px"
            priority
          />
        )}
      </div>

      {images.length > 1 ? (
        <div className="pdp__thumbs" role="group" aria-label={`${name} views`}>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className="pdp__thumb"
              aria-current={index === active}
              aria-label={`View ${index + 1} of ${images.length}`}
              onClick={() => setActive(index)}
            >
              {isVideo(image.src) ? (
                <video src={image.src} muted playsInline preload="metadata" />
              ) : (
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="72px"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
