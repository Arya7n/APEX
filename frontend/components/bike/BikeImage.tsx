"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { PLACEHOLDER_MACHINE_IMAGE } from "@/lib/images";
import { cn } from "@/lib/cn";

type BikeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * Bike photos may be local or remote (Wikipedia/Commons).
 * Remote URLs skip the Next optimizer — Wikimedia often times out via /_next/image.
 */
export function BikeImage({ src, alt, className, onError, ...props }: BikeImageProps) {
  const initial = src || PLACEHOLDER_MACHINE_IMAGE;
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    setCurrent(src || PLACEHOLDER_MACHINE_IMAGE);
  }, [src]);

  const remote = isRemote(current);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      unoptimized={remote}
      className={cn(className)}
      onError={(event) => {
        if (current !== PLACEHOLDER_MACHINE_IMAGE) {
          setCurrent(PLACEHOLDER_MACHINE_IMAGE);
        }
        onError?.(event);
      }}
    />
  );
}
