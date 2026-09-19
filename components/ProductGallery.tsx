'use client';

import Image from 'next/image';
import { useState } from 'react';
import { imageSize } from '@/lib/image-sizes';
import { isVideo } from '@/lib/products';

export function ProductGallery({
  images,
  name,
  wood,
}: {
  images: string[];
  name: string;
  wood: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return <div className="pdp__stage" aria-hidden="true" />;

  return (
    <div className="pdp__gallery">
      <div className="pdp__stage">
        {isVideo(current) ? (
          <video src={current} controls playsInline preload="metadata" />
        ) : (
          <Image
            src={current}
            alt={`${name}, engraved ${wood}`}
            width={imageSize(current).w}
            height={imageSize(current).h}
            sizes="(max-width: 900px) 92vw, 560px"
            priority
          />
        )}
      </div>

      {images.length > 1 ? (
        <div className="pdp__thumbs" role="group" aria-label={`${name} views`}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className="pdp__thumb"
              aria-current={index === active}
              aria-label={`View ${index + 1} of ${images.length}`}
              onClick={() => setActive(index)}
            >
              {isVideo(src) ? (
                <video src={src} muted playsInline preload="metadata" />
              ) : (
                <Image
                  src={src}
                  alt=""
                  width={imageSize(src).w}
                  height={imageSize(src).h}
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
