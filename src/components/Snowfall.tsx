import React, { useEffect, useRef, useState } from 'react';

const SNOW_REPEL_RADIUS = 80;
const SNOW_REPEL_STRENGTH = 45;
const LERP = 0.12;

type ThemeMode = 'dark' | 'light';

export interface SnowfallProps {
  theme?: ThemeMode;
}

export const Snowfall: React.FC<SnowfallProps> = ({ theme = 'dark' }) => {
  const [flakes, setFlakes] = useState<
    { id: number; left: string; duration: string; delay: string; size: string; opacity: number; blur: string; sway: string }[]
  >([]);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const smoothRef = useRef<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    const narrow = typeof window !== 'undefined' && window.innerWidth < 768;
    const flakeCount = narrow ? 70 : 120;
    wrapperRefs.current = [];
    particleRefs.current = [];
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
      const particles = particleRefs.current;
      const wrappers = wrapperRefs.current;
      const smooth = smoothRef.current;

      for (let i = 0; i < particles.length; i++) {
        const el = particles[i];
        const wrap = wrappers[i];
        if (!el || !wrap) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tx = 0;
        let ty = 0;
        if (dist < SNOW_REPEL_RADIUS && dist > 0) {
          const f = (1 - dist / SNOW_REPEL_RADIUS) * SNOW_REPEL_STRENGTH;
          tx = (dx / dist) * f;
          ty = (dy / dist) * f;
        }

        const s = smooth[i] ?? { x: 0, y: 0 };
        const nx = s.x + (tx - s.x) * LERP;
        const ny = s.y + (ty - s.y) * LERP;
        smooth[i] = { x: nx, y: ny };
        wrap.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden snow-layer"
      aria-hidden
      data-snow-theme={isLight ? 'light' : 'dark'}
    >
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
          border-radius: 50%;
          animation: snow-fall ease-in-out infinite;
          will-change: transform;
        }
        [data-snow-theme="dark"] .snow-particle {
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
        }
        [data-snow-theme="light"] .snow-particle {
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(100,116,139,0.45), rgba(148,163,184,0.25));
          box-shadow: 0 0 4px rgba(71, 85, 105, 0.25);
        }
        .snow-wrapper {
          position: absolute;
          top: 0;
          will-change: transform;
        }
      `}</style>
      {flakes.map((flake, i) => (
        <div
          key={flake.id}
          ref={(r) => {
            wrapperRefs.current[i] = r;
          }}
          className="snow-wrapper"
          style={{ left: flake.left }}
        >
          <div
            ref={(r) => {
              particleRefs.current[i] = r;
            }}
            className="snow-particle"
            style={
              {
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                filter: `blur(${flake.blur})`,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
                ['--sway']: flake.sway,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
};
