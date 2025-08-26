'use client';

import { useEffect, useRef, useState } from "react";

export type Progress = { stars: number; xp: number };

export function useProgress(levelKey: string) {
  const [progress, setProgress] = useState<Progress>({ stars: 0, xp: 0 });
  const savedOnce = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${levelKey}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [levelKey]);

  function complete(stars: number, xp: number) {
    // keep the best result (don’t downgrade stars/xp)
    setProgress(prev => {
      const better: Progress = {
        stars: Math.max(prev.stars, stars),
        xp: Math.max(prev.xp, xp),
      };
      localStorage.setItem(`progress_${levelKey}`, JSON.stringify(better));
      return better;
    });
  }

  // utility to ensure we only mark complete once from a condition
  function completeOnce(stars: number, xp: number) {
    if (savedOnce.current) return;
    savedOnce.current = true;
    complete(stars, xp);
  }

  return { progress, complete, completeOnce };
}
