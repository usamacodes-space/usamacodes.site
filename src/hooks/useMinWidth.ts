import { useEffect, useState } from 'react';

/**
 * True when viewport is at least `minPx` wide (client-only; false during SSR/first paint).
 * Use to skip heavy visuals (WebGL, particle effects) on phones for LCP / TBT.
 */
export function useMinWidth(minPx: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minPx}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [minPx]);

  return matches;
}
