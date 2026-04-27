"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import Link from "next/link";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>~|=+-_*";

const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`orb ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.15, 0.25, 0.15],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const GeometricShape = ({ className, rotation, size = 60 }: { className: string; rotation: number; size?: number }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      rotate: rotation,
      scale: [1, 1.1, 1],
    }}
    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <polygon
        points="30,5 55,50 5,50"
        fill="none"
        stroke="rgba(0,255,0,0.15)"
        strokeWidth="1"
      />
    </svg>
  </motion.div>
);

function MatrixCodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const animationRef = useRef<number>();
  const fontSize = 12;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columnCount = Math.floor(canvas.width / fontSize);
      // Randomize initial positions so drops are staggered
      dropsRef.current = Array(columnCount).fill(0).map(() => Math.random() * -100);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px monospace`;

      dropsRef.current.forEach((drop, i) => {
        const x = i * fontSize;

        // Head character - bright green
        ctx.fillStyle = "#00ff00";
        ctx.fillText(getRandomChar(), x, drop * fontSize);

        // Trail - darker green
        ctx.fillStyle = "rgba(0, 180, 0, 0.6)";
        for (let t = 1; t <= 5; t++) {
          const trailY = (drop - t) * fontSize;
          if (trailY > 0 && trailY < canvas.height) {
            ctx.fillText(getRandomChar(), x, trailY);
          }
        }

        // Reset when off screen
        if (drop * fontSize > canvas.height) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 w-full h-full pointer-events-none"
    />
  );
}

export default function Hero() {
  const { messages } = useLanguage();
  const t = messages.hero;

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/jzimg.png')`,
        }}
      />

      {/* Matrix code rain effect */}
      <MatrixCodeRain />

      {/* Gradient overlay - lighter to show background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/30 via-[#09090b]/50 to-[#09090b] z-10" />

      {/* Subtle decorative orbs - Matrix green */}
      <FloatingOrb className="orb-green w-[400px] h-[400px] top-[-100px] left-[-100px] opacity-15" delay={0} />
      <FloatingOrb className="orb-green-dark w-[300px] h-[300px] bottom-[20%] right-[-100px] opacity-10" delay={2} />

      {/* Geometric shapes - Matrix green */}
      <GeometricShape className="top-[20%] left-[8%]" rotation={360} />
      <GeometricShape className="bottom-[30%] right-[12%]" rotation={-360} />

      {/* Content */}
      <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">
        {/* Status badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "backOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/10 backdrop-blur-xl">
            <motion.span
              className="status-dot"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground/90">
              Web3 Developer
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-xs text-foreground/50"
            >
              Available for work
            </motion.span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Hi, I&apos;m{" "}
          </motion.span>
          <motion.span
            className="gradient-text glow-text"
            animate={{
              textShadow: [
                "0 0 60px rgba(168, 85, 247, 0.5), 0 0 120px rgba(168, 85, 247, 0.5)",
                "0 0 80px rgba(168, 85, 247, 0.7), 0 0 160px rgba(168, 85, 247, 0.7)",
                "0 0 60px rgba(168, 85, 247, 0.5), 0 0 120px rgba(168, 85, 247, 0.5)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {t.title}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-3">
            <motion.span
              className="gradient-text"
              animate={{ backgroundPosition: ["0%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {t.subtitle1}
            </motion.span>
          </h2>
          <motion.h2
            className="text-lg md:text-xl font-light text-emerald-400/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t.subtitle2}
          </motion.h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto mb-14 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {t.description}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="#about" className="btn-primary flex items-center gap-3 group">
              <span>{t.cta}</span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/blog" className="btn-secondary flex items-center gap-2">
              <span>{t.viewBlog}</span>
              <ExternalLink size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[
            { href: "https://github.com/joeyzone", label: "GitHub" },
            { href: "https://t.me/joeyzoneone", label: "Telegram" },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full glass border border-white/10 text-sm text-foreground/60 hover:text-foreground hover:border-purple-500/50 transition-all"
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.span
          className="text-xs font-mono tracking-[0.3em] text-foreground/40"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={24} className="text-foreground/40" />
        </motion.div>
      </motion.button>
    </section>
  );
}