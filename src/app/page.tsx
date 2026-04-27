"use client";

import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Code2, Layers, Zap, Shield } from "lucide-react";
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
    description:
      "Built cross-chain bridge projects supporting Bitlayer, Taker, B², AINN, CKB, SatoshiVM, Fractal, Duckchain and more.",
    tech: ["Solidity", "Hardhat", "Bridge", "DeFi"],
    highlight: true,
    icon: "icon1.png",
  },
  {
    title: "DEX Protocol",
    description:
      "Responsible for the development and maintenance of the DEX public chain project's lending and insurance fund modules.",
    tech: ["Solidity", "Rust", "Polkadot/Substrate"],
    highlight: false,
    icon: "icon2.png",
  },
  {
    title: "Exploring DAO Governance",
    description:
      "Responsible for the deployment, implementation, and maintenance of DAO governance smart contracts.",
    tech: ["Solidity", "MakerDAO", "Token"],
    highlight: false,
    icon: "icon3.png",
  },
];

const blogPosts = [
  {
    title: "Exploring DAO Governance",
    excerpt: "Deep dive into MakerDAO governance: voting process, smart contracts and execution mechanism",
    date: "2024",
    tags: ["DeFi", "DAO", "MakerDAO"],
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
        <section id="about" className="py-40 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

          <div className="max-w-6xl mx-auto relative">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-4xl md:text-5xl font-bold">{t.about.title}</h2>
              </motion.div>
              <p className="text-lg text-foreground/50 max-w-2xl mb-20">
                {t.about.subtitle}
              </p>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12">
              <AnimatedSection delay={0.1}>
                <motion.p
                  className="text-lg md:text-xl text-foreground/60 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.about.description}
                </motion.p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skillGroup, idx) => (
                    <motion.div
                      key={skillGroup.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="p-6 rounded-2xl glass border border-white/5 hover:border-purple-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                          <skillGroup.icon size={20} />
                        </div>
                        <h3 className="text-sm font-mono text-emerald-400/80 tracking-wider">
                          {skillGroup.category.toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-foreground/70 hover:bg-purple-500/20 hover:text-purple-300 transition-all cursor-default"
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
        <section id="projects" className="py-40 px-6 relative bg-gradient-to-b from-transparent via-card-bg/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-4xl md:text-5xl font-bold">{t.projects.title}</h2>
              </motion.div>
              <p className="text-lg text-foreground/50 max-w-2xl mb-20">
                {t.projects.subtitle}
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <AnimatedSection key={project.title} delay={idx * 0.1}>
                  <motion.div
                    className={`group relative h-full p-8 rounded-3xl transition-all duration-500 card-hover ${
                      project.highlight
                        ? "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 glow-border"
                        : "glass border border-white/5"
                    }`}
                    whileHover={{ y: -10 }}
                  >
                    {project.highlight && (
                      <motion.div
                        className="absolute top-4 right-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <span className="px-3 py-1.5 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                          Featured
                        </span>
                      </motion.div>
                    )}

                    {/* Project icon */}
                    <img
                      src={`/${project.icon}`}
                      alt={project.title}
                      className="w-16 h-16 object-contain mb-6"
                    />

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-foreground/50 mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span
                          key={`${tech}-${i}`}
                          className="tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section id="blog-preview" className="py-40 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <motion.div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold gradient-text">/</span>
                <h2 className="text-4xl md:text-5xl font-bold">{t.blog.title}</h2>
              </motion.div>
              <p className="text-lg text-foreground/50 max-w-2xl mb-16">
                {t.blog.subtitle}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post, idx) => (
                  <motion.article
                    key={post.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="group p-8 rounded-3xl glass border border-white/5 hover:border-purple-500/30 transition-all duration-500 card-hover"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="tag">Article</span>
                      <span className="text-sm text-foreground/40">{post.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-foreground/50 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group/link"
                    >
                      <span>Read more</span>
                      <ArrowRight
                        size={16}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-16 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass border border-white/10 hover:border-purple-500/50 transition-all group"
                >
                  <span className="text-lg">View all posts</span>
                  <motion.span
                    className="text-purple-400"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider" />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/header.png" alt="Jun" className="h-8 w-auto" />
            <span className="text-foreground/40">© 2024 Jun</span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/joeyzone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/40 hover:text-purple-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="/blog"
              className="text-sm text-foreground/40 hover:text-purple-400 transition-colors"
            >
              Blog
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}