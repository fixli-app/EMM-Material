import { useEffect, useRef, useState } from "react";

/**
 * Returns a scroll-based Y offset for parallax effects.
 * `speed` controls intensity: 0.3 = subtle, 0.5 = moderate.
 */
export function useParallax(speed = 0.35) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateOffset = () => {
      const el = ref.current;

      if (!el) {
        setOffset(0);
        return;
      }

      const rect = el.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        return;
      }

      setOffset(rect.top * speed * -1);
    };

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateOffset();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return { ref, offset };
}

