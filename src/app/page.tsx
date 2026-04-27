"use client";

import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Code2, Layers, Zap, Shield, Calendar, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/context";

const skills = [
  {
    category: "Smart Contracts",
    icon: Code2,
    items: ["Solidity", "OpenZeppelin", "Hardhat", "WTF Solidity"],
  },
  {
    category: "Blockchain",
    icon: Layers,
    items: ["Polkadot", "Substrate", "EVM", "Cross-chain"],
  },
  {
    category: "Protocols",
    icon: Zap,
    items: ["DEX", "DeFi", "MakerDAO", "Uniswap"],
  },
  {
    category: "Frontend",
    icon: Shield,
    items: ["React", "TypeScript", "Vue", "Node.js"],
  },
];

const projects = [
  {
    title: "Cross-chain Bridge",
    description: "Built cross-chain bridge projects supporting Bitlayer, Taker, B², AINN, CKB, SatoshiVM, Fractal, Duckchain and more.",
    tech: ["Solidity", "Hardhat", "Bridge", "DeFi"],
    role: "Lead Engineer",
    status: "Multi-chain",
    stack: "solidity / hardhat / ethers",
    icon: "icon1.png",
  },
  {
    title: "DEX Protocol",
    description: "Responsible for the development and maintenance of the DEX public chain project's lending and insurance fund modules.",
    tech: ["Solidity", "Rust", "Substrate"],
    role: "Core Dev",
    status: "Protocol",
    stack: "solidity / rust / substrate",
    icon: "icon2.png",
  },
  {
    title: "DAO Governance",
    description: "Responsible for the deployment, implementation, and maintenance of DAO governance smart contracts.",
    tech: ["Solidity", "MakerDAO", "Token"],
    role: "Governance Lead",
    status: "Governance",
    stack: "solidity / makerdao / token",
    icon: "icon3.png",
  },
];

const notes = [
  {
    title: "Uniswap V2 Core Formulas",
    excerpt: "AMM constant product, slippage, fees, LP shares, price oracle and impermanent loss",
    date: "2024",
    tags: ["DeFi", "AMM"],
    slug: "uniswapv2",
  },
  {
    title: "Uniswap V3 Core Mechanisms",
    excerpt: "Concentrated liquidity, price range, tick, sqrtPriceX96, swap calculation and LP position value",
    date: "2024",
    tags: ["DeFi", "AMM"],
    slug: "uniswapv3",
  },
  {
    title: "Aave Interest Rate Model",
    excerpt: "Borrow rate, supply rate, utilization ratio, reserve factor and index accumulator mechanism",
    date: "2024",
    tags: ["DeFi", "Lending"],
    slug: "aave",
  },
];

export default function Home() {
  const { messages } = useLanguage();
  const t = messages;

  return (
    <>
      <Navigation />

      <main className="flex-1">
        <Hero />

        {/* About Section */}
        <section id="about" className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#a855f7]/5 to-transparent" />

          <div className="max-w-6xl mx-auto relative">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-3xl md:text-4xl font-bold">{t.about.title}</h2>
              </motion.div>
            </AnimatedSection>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { value: "3+", label: "Years" },
                { value: "8+", label: "Projects" },
                { value: "50+", label: "Contracts" },
                { value: "∞", label: "Security Mindset" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="p-5 rounded-xl glass border border-[#a855f7]/20 bg-gradient-to-br from-[#a855f7]/5 to-transparent"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm font-mono text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <AnimatedSection delay={0.1}>
                <motion.p
                  className="text-base md:text-lg text-foreground/60 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.about.description}
                </motion.p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skillGroup, idx) => (
                    <motion.div
                      key={skillGroup.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="p-5 rounded-xl glass border border-white/5 hover:border-[#a855f7]/30 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#a855f7]/10 text-[#a855f7]">
                          <skillGroup.icon size={16} />
                        </div>
                        <h3 className="text-xs font-mono text-[#10b981]/80 tracking-wider uppercase">
                          {skillGroup.category}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillGroup.items.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 text-xs bg-white/5 rounded-md text-foreground/60 hover:bg-[#a855f7]/10 hover:text-[#a855f7] transition-all cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6 relative bg-gradient-to-b from-transparent via-[#3b82f6]/3 to-transparent">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-3xl md:text-4xl font-bold">{t.projects.title}</h2>
              </motion.div>
              <p className="text-base text-foreground/50 max-w-2xl mb-14">
                {t.projects.subtitle}
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-5">
              {projects.map((project, idx) => (
                <AnimatedSection key={project.title} delay={idx * 0.1}>
                  <motion.div
                    className="cyber-card p-6 h-full flex flex-col group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    {/* Header with icon and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="pixel-badge">
                        <img
                          src={`/${project.icon}`}
                          alt={project.title}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <span className="status-badge">{project.status}</span>
                    </div>

                    {/* Terminal metadata */}
                    <div className="mb-4 font-mono text-xs space-y-1">
                      <div className="text-[#06b6d4]/70">
                        <span className="text-foreground/40">{"// "}</span>
                        <span className="text-foreground/60">role:</span>{" "}
                        <span className="text-[#a855f7]">{project.role.toLowerCase().replace(' ', '_')}</span>
                      </div>
                      <div className="text-[#06b6d4]/70">
                        <span className="text-foreground/40">{"// "}</span>
                        <span className="text-foreground/60">stack:</span>{" "}
                        <span className="text-foreground/50">{project.stack}</span>
                      </div>
                      <div>
                        <span className="text-foreground/40">{"// "}</span>
                        <span className="text-foreground/60">status:</span>{" "}
                        <span className="text-[#10b981] font-semibold">deployed</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-[#a855f7] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-foreground/50 mb-4 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog-preview" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-3xl md:text-4xl font-bold">{t.blog.title}</h2>
              </motion.div>
              <p className="text-base text-foreground/50 max-w-2xl mb-12">
                {t.blog.subtitle}
              </p>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured Article */}
              <AnimatedSection delay={0.1}>
                <motion.article
                  className="featured-card p-8 h-full group cursor-pointer flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Category & Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-mono bg-[#a855f7]/20 text-[#a855f7] rounded-full border border-[#a855f7]/30">
                        Featured
                      </span>
                      <span className="px-2 py-1 text-xs font-mono bg-[#3b82f6]/10 text-[#3b82f6] rounded border border-[#3b82f6]/20">
                        DeFi / Governance
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 group-hover:text-[#a855f7] transition-colors">
                    MakerDAO Governance: From Voting to Spell Execution
                  </h3>

                  <p className="text-foreground/50 mb-6 leading-relaxed flex-1">
                    Deep dive into MakerDAO governance: voting process, smart contracts and execution mechanism. Understand how MKR holders control the protocol through on-chain voting, executive votes, and the governance architecture including the Pause, ESM, and DAI bride modules.
                  </p>

                  {/* Full excerpt */}
                  <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5">
                    <p className="text-xs font-mono text-foreground/40 leading-relaxed">
                      Topics: Voting mechanisms • Smart contract security • MakerDAO architecture • Executive governance • Risk management
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-mono text-foreground/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        2024
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        8 min read
                      </span>
                    </div>
                    <Link
                      href="/blog/1"
                      className="flex items-center gap-1 text-sm text-[#a855f7] hover:gap-2 transition-all"
                    >
                      Read <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              </AnimatedSection>

              {/* Recent Notes */}
              <div className="flex flex-col gap-4">
                {notes.map((note, idx) => (
                  <AnimatedSection key={note.title} delay={0.2 + idx * 0.1}>
                    <Link href={note.slug ? `/blog/${note.slug}` : "/blog"}>
                      <motion.article
                        className="note-card flex items-start gap-4 group cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-semibold group-hover:text-[#a855f7] transition-colors">
                              {note.title}
                            </h4>
                            <span className="text-xs text-foreground/30">•</span>
                            <span className="text-xs text-foreground/40 font-mono">{note.date}</span>
                          </div>
                          <p className="text-xs text-foreground/50 mb-2 line-clamp-1">
                            {note.excerpt}
                          </p>
                          <div className="flex gap-1.5">
                            {note.tags.map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-white/5 rounded text-foreground/40">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  </AnimatedSection>
                ))}

                {/* View all link */}
                <AnimatedSection delay={0.5}>
                  <Link
                    href="/blog"
                    className="flex items-center justify-center gap-2 py-4 rounded-xl glass border border-white/5 hover:border-[#a855f7]/30 transition-all text-sm text-foreground/50 hover:text-[#a855f7]"
                  >
                    <span>View all posts</span>
                    <ArrowRight size={16} />
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider" />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/header.png" alt="Jun" className="h-7 w-auto" />
            <span className="text-foreground/30 text-sm">© 2024 Jun</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/joeyzone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/40 hover:text-[#a855f7] transition-colors"
            >
              GitHub
            </a>
            <a
              href="/blog"
              className="text-sm text-foreground/40 hover:text-[#a855f7] transition-colors"
            >
              Blog
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
