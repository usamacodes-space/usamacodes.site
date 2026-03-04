import React, { useEffect, useRef, useState } from 'react';

const SNOW_REPEL_RADIUS = 80;
const SNOW_REPEL_STRENGTH = 45;
const LERP = 0.1;

export const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: string; duration: string; delay: string; size: string; opacity: number; blur: string; sway: string }[]>([]);
  const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const flakeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const smoothRef = useRef<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    const flakeCount = 120;
    flakeRefs.current = [];
    const newFlakes = Array.from({ length: flakeCount }).map((_, i) => {
      const size = Math.random() * 4 + 1;
      const speed = 8 + Math.random() * 14;
      const sway = 20 + Math.random() * 40;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        duration: `${speed}s`,
        delay: `${Math.random() * -25}s`,
        size: `${size}px`,
        opacity: 0.4 + Math.random() * 0.5,
        blur: size < 2 ? '0.5px' : size < 3 ? '0px' : '1px',
        sway: `${sway}px`,
      };
    });
    setFlakes(newFlakes);
  }, []);

  useEffect(() => {
    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const target: Record<number, { x: number; y: number }> = {};
      for (let i = 0; i < flakeRefs.current.length; i++) {
        const el = flakeRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SNOW_REPEL_RADIUS && dist > 0) {
          const f = (1 - dist / SNOW_REPEL_RADIUS) * SNOW_REPEL_STRENGTH;
          target[i] = { x: (dx / dist) * f, y: (dy / dist) * f };
        } else {
          target[i] = { x: 0, y: 0 };
        }
      }
      const smooth = smoothRef.current;
      const next: Record<number, { x: number; y: number }> = {};
      const allKeys = new Set([...Object.keys(target).map(Number), ...Object.keys(smooth).map(Number)]);
      for (const i of allKeys) {
        const t = target[i] ?? { x: 0, y: 0 };
        const s = smooth[i] ?? { x: 0, y: 0 };
        const nx = s.x + (t.x - s.x) * LERP;
        const ny = s.y + (t.y - s.y) * LERP;
        next[i] = { x: nx, y: ny };
        smooth[i] = next[i];
      }
      setOffsets({ ...next });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      rafRef.current && cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden>
      <style>{`
        @keyframes snow-fall {
          0% { transform: translateY(-5vh) translateX(0) rotate(0deg); }
          25% { transform: translateY(30vh) translateX(var(--sway)) rotate(90deg); }
          50% { transform: translateY(60vh) translateX(calc(var(--sway) * -0.5)) rotate(180deg); }
          75% { transform: translateY(85vh) translateX(var(--sway)) rotate(270deg); }
          100% { transform: translateY(115vh) translateX(0) rotate(360deg); }
        }
        .snow-particle {
          position: absolute;
          top: -10px;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
          animation: snow-fall ease-in-out infinite;
        }
        .snow-wrapper {
          transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
        }
      `}</style>
      {flakes.map((flake, i) => {
        const off = offsets[flake.id] ?? { x: 0, y: 0 };
        return (
          <div
            key={flake.id}
            className="snow-wrapper absolute"
            style={{
              left: flake.left,
              top: 0,
              transform: `translate(${off.x}px, ${off.y}px)`,
            }}
          >
            <div
              ref={(r) => { flakeRefs.current[i] = r; }}
              className="snow-particle"
              style={{
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                filter: `blur(${flake.blur})`,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
                ['--sway']: flake.sway,
              } as React.CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
};
