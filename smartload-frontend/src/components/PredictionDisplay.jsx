import { useEffect, useRef, useState } from 'react';

function useAnimatedNumber(target, duration = 400) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef();
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return undefined;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress); // ease-out
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}

export default function PredictionDisplay({ label, value, colorClassName = 'text-primary' }) {
  const animated = useAnimatedNumber(value ?? 0);

  return (
    <div className="flex flex-col">
      <span className="text-xs text-text-secondary mb-0.5">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold tabular-nums ${colorClassName}`}>
          {animated.toFixed(2)}
        </span>
        <span className="text-xs text-text-secondary">kWh/m²</span>
      </div>
    </div>
  );
}
