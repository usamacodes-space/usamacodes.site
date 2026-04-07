'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

function fallbackUrl(size: number) {
  return `https://ui-avatars.com/api/?name=Usama+Shafique&size=${size}&background=0f1117&color=f97316`;
}

type AvatarImageProps = {
  /** Intrinsic pixel size (used for Next/Image and fallback avatar API). */
  size: number;
  className?: string;
  alt?: string;
  /** Optional `sizes` for responsive layouts (e.g. `(max-width: 640px) 64px, 80px`). */
  sizes?: string;
  priority?: boolean;
};

export function AvatarImage({
  size,
  className,
  alt = 'Usama Shafique',
  sizes,
  priority = false,
}: AvatarImageProps) {
  const [src, setSrc] = useState('/avatar.jpg');

  const onError = useCallback(() => {
    setSrc((current) => (current.includes('ui-avatars.com') ? current : fallbackUrl(size)));
  }, [size]);

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      sizes={sizes ?? `${size}px`}
      priority={priority}
      onError={onError}
    />
  );
}
