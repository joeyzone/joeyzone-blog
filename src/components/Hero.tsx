"use client";

import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import Link from "next/link";

export default function Hero() {
    const { messages } = useLanguage();
    const t = messages.hero;

    const scrollToAbout = () => {
        document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 web3-grid" />

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-full bg-accent/5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-foreground/70">
                                Web3 Developer
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-foreground">Hi, I&apos;m </span>
                        <span className="gradient-text glow-text">
                            {t.title}
                        </span>
                    </motion.h1>

                    <motion.div
                        className="h-12 md:h-16 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-light text-foreground/70">
                            <span className="gradient-text">{t.subtitle1}</span>
                            <span className="text-foreground/40 mx-3">|</span>
                            <span className="text-emerald-400/80">
                                {t.subtitle2}
                            </span>
                        </h2>
                    </motion.div>

                    <motion.p
                        className="text-lg text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {t.description}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <a
                            href="#about"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            {t.cta}
                        </a>
                        <Link
                            href="/blog"
                            className="px-8 py-3 border border-card-border text-foreground font-medium rounded-lg hover:border-accent hover:text-accent transition-all flex items-center gap-2"
                        >
                            {t.viewBlog} <ExternalLink size={16} />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-16 flex items-center justify-center gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <a
                        href="https://github.com/joeyzone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground/40 hover:text-accent transition-colors flex items-center gap-2"
                    >
                        <span className="font-mono">github</span>
                        <span className="text-xs">↗</span>
                    </a>
                </motion.div>
            </div>

            <motion.button
                onClick={scrollToAbout}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/30 hover:text-accent transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 1.5 },
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                }}
            >
                <ChevronDown size={32} />
            </motion.button>
        </section>
    );
}
