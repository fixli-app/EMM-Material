import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Orb {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

const FloatingOrbs = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create orbs
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    orbsRef.current = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 80 + Math.random() * 180,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: 0.03 + Math.random() * 0.05,
      hue: Math.random() > 0.5 ? 195 : 215,
    }));

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      orbsRef.current.forEach((orb) => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Bounce softly
        if (orb.x < -orb.size) orb.x = cw + orb.size;
        if (orb.x > cw + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = ch + orb.size;
        if (orb.y > ch + orb.size) orb.y = -orb.size;

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        );
        const lightness = orb.hue === 195 ? "55%" : "35%";
        gradient.addColorStop(0, `hsla(${orb.hue}, 85%, ${lightness}, ${orb.opacity})`);
        gradient.addColorStop(1, `hsla(${orb.hue}, 85%, ${lightness}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default FloatingOrbs;
