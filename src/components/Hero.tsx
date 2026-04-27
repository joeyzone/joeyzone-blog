"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import Link from "next/link";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

function MatrixCodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const fontSize = 14;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columnCount = Math.floor(canvas.width / fontSize);
      dropsRef.current = Array(columnCount).fill(0).map(() => Math.random() * -100);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime < 40) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px monospace`;

      dropsRef.current.forEach((drop, i) => {
        const x = i * fontSize;

        // Only draw on left third and right third (not center)
        if (x > canvas.width * 0.35 && x < canvas.width * 0.65) {
          dropsRef.current[i] += 2; // Move faster but skip drawing
          if (dropsRef.current[i] * fontSize > canvas.height) {
            dropsRef.current[i] = 0;
          }
          return;
        }

        // Head character - cyber purple-blue
        ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
        ctx.fillText(getRandomChar(), x, drop * fontSize);

        // Trail - darker purple
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        for (let t = 1; t <= 4; t++) {
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
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
}

function CyberOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
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
}

export default function Hero() {
  const { messages } = useLanguage();
  const t = messages.hero;

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen min-h-[760px] flex items-center overflow-hidden">
      {/* Background image - right side */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center z-0 opacity-40"
        style={{
          backgroundImage: `url('/jzimg.png')`,
        }}
      />

      {/* Deep mask for left side */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: `linear-gradient(to right, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.8) 50%, rgba(9, 9, 11, 0.4) 100%)`
      }} />

      {/* Matrix code rain on edges */}
      <MatrixCodeRain />

      {/* Purple/Blue decorative orbs */}
      <CyberOrb className="orb-purple w-[500px] h-[500px] top-[-150px] left-[-150px] opacity-20" delay={0} />
      <CyberOrb className="orb-blue w-[400px] h-[400px] bottom-[10%] right-[-100px] opacity-15" delay={2} />

      {/* Content - left aligned */}
      <div className="relative z-30 text-left px-6 md:px-12 max-w-3xl">
        {/* Status badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "backOut" }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-[#a855f7]/20 backdrop-blur-xl">
            <motion.span
              className="w-2 h-2 rounded-full bg-[#10b981]"
              animate={{ scale: [1, 1.3, 1], boxShadow: ["0 0 4px #10b981", "0 0 8px #10b981", "0 0 4px #10b981"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground/90">
              Smart Contract Engineer
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-xs font-mono text-[#10b981]"
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
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-3">
            <motion.span
              className="gradient-text"
              animate={{ backgroundPosition: ["0%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {t.subtitle1}
            </motion.span>
          </h2>
          <motion.p
            className="text-sm md:text-base font-mono text-[#06b6d4]/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t.subtitle2}
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {t.description}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
          className="mt-14 flex items-center justify-center gap-4"
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
              className="px-5 py-2 rounded-lg glass border border-white/10 text-sm text-foreground/60 hover:text-[#a855f7] hover:border-[#a855f7]/50 transition-all"
              whileHover={{ y: -3 }}
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
        className="absolute bottom-10 left-12 flex flex-col items-center gap-2 z-30"
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
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-foreground/40" />
        </motion.div>
      </motion.button>
    </section>
  );
}
