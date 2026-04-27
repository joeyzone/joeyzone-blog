"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/context";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages } = useLanguage();
  const t = messages.nav;

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/projects", label: t.projects },
    { href: "/blog", label: t.blog },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/5"
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <motion.img
            src="/header.png"
            alt="Jun"
            className="h-9 w-auto object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <span className="hidden sm:inline text-sm font-mono text-foreground/60 group-hover:text-foreground transition-colors">
            joeyzone
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, idx) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={link.href}
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-3"
          >
            <LanguageSwitcher />
            <div className="w-px h-5 bg-white/10" />
            <a
              href="https://github.com/joeyzone"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground/50 hover:text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/50 hover:text-foreground">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
                      </motion.div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground/70 hover:text-foreground py-2 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center gap-4 pt-4 mt-2 border-t border-white/5">
                <LanguageSwitcher />
                <div className="flex items-center gap-3 ml-auto">
                  <a
                    href="https://github.com/joeyzone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/5 text-foreground/50"
                  >
                    <Github size={20} />
                  </a>
                                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}