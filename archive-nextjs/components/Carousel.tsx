"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Carousel({
  items,
  startIndex = 0,
  autoAdvanceMs = 7000,
}: {
  items: React.ReactNode[];
  startIndex?: number;
  autoAdvanceMs?: number;
}) {
  const N = items.length;
  const [index, setIndex] = useState(((startIndex % N) + N) % N);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardW = 320;
  const cardH = 420; // ensure stable layout height
  const gap = 32;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % N);
    }, autoAdvanceMs);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [N, autoAdvanceMs]);

  const trio = useMemo(() => {
    const left = (index - 1 + N) % N;
    const center = index % N;
    const right = (index + 1) % N;
    return [left, center, right];
  }, [index, N]);

  const positions = [-(cardW + gap), 0, cardW + gap];

  const spring = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as const;

  return (
    <div
      className="w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <motion.div
        className="relative mx-auto"
        style={{ width: cardW * 3 + gap * 2, height: cardH }}
      >
        {trio.map((idx, i) => {
          const isCenter = i === 1;
          return (
            <motion.div
              key={`carousel-${idx}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: cardW, height: cardH }}
              initial={{ x: positions[i], scale: isCenter ? 1.04 : 0.94, opacity: isCenter ? 1 : 0.78 }}
              animate={{ x: positions[i], scale: isCenter ? 1.06 : 0.92, opacity: isCenter ? 1 : 0.68, zIndex: isCenter ? 2 : 1 }}
              transition={spring}
              aria-hidden={!isCenter}
            >
              <div className="h-full">
                {items[idx]}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
