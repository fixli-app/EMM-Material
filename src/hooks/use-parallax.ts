import { useEffect, useRef, useState } from "react";

/**
 * Returns a scroll-based Y offset for parallax effects.
 * `speed` controls intensity: 0.3 = subtle, 0.5 = moderate.
 */
export function useParallax(speed = 0.35) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          // Only calculate when section is visible
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            setOffset(rect.top * speed * -1);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return { ref, offset };
}
