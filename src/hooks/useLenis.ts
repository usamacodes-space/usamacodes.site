import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

export function useLenis(wrapperRef: React.RefObject<HTMLElement | null>) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const content = wrapper.firstElementChild as HTMLElement;
    if (!content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef]);

  return lenisRef;
}
