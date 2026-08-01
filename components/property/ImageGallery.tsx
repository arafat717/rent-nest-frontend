"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length ? images : ["/placeholder-property.jpg"];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={gallery[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((image, index) => (
            <button
              key={image + index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-md border-2",
                activeIndex === index ? "border-primary" : "border-transparent",
              )}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
