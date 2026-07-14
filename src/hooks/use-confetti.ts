"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback((options?: confetti.Options) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF6B00", "#0A1A2F", "#FFFFFF"], // Brand colors: Orange, Navy, White
      ...options,
    });
  }, []);

  const fireSuccess = useCallback(() => {
    fire({
      particleCount: 150,
      spread: 100,
      scalar: 1.2,
    });
  }, [fire]);

  const firePride = useCallback(() => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#FF6B00", "#0A1A2F"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return { fire, fireSuccess, firePride };
}
