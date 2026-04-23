"use client";

import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/context";

const skills = [
    {
        category: "Smart Contracts",
        items: ["Solidity", "OpenZeppelin", "Hardhat", "WTF Solidity"],
    },
    {
        category: "Blockchain",
        items: ["Polkadot", "Substrate", "EVM", "Cross-chain"],
    },
    { category: "Protocols", items: ["DEX", "DeFi", "MakerDAO", "Uniswap"] },
    { category: "Frontend", items: ["React", "TypeScript", "Vue", "Node.js"] },
];

const projects = [
    {
        title: "Cross-chain Bridge",
        description:
            "Built cross-chain bridge projects supporting Bitlayer, Taker, B², AINN, CKB, SatoshiVM, Fractal, Duckchain and more.",
        tech: ["Solidity", "Hardhat", "Bridge", "DeFi"],
        highlight: true,
    },
    {
        title: "DEX Protocol",
        description:
            "Responsible for the development and maintenance of the DEX public chain project’s lending and insurance fund modules, including Substrate framework customization and on-chain logic implementation.",
        tech: ["Solidity", "Rust", "Polkadot/Substrate"],
        highlight: false,
    },
    {
        title: "DAO",
        description:
            "Responsible for the deployment, implementation, and maintenance of DAO governance smart contracts, enabling the on-chain execution of governance mechanisms.",
        tech: ["Solidity", "MakeDAO", "Token"],
        highlight: false,
    },
];

export default function Home() {
    const { messages } = useLanguage();
    const t = messages;

    return (
        <>
            <MouseFollower />
            <Navigation />

            <main className="flex-1">
                <Hero />

                <section id="about" className="py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="gradient-text">/</span>{" "}
                                {t.about.title}
                            </h2>
                            <p className="text-foreground/60 max-w-2xl mb-16">
                                {t.about.subtitle}
                            </p>
                        </AnimatedSection>

                        <div className="grid lg:grid-cols-2 gap-16">
                            <AnimatedSection delay={0.1}>
                                <div className="space-y-6 text-foreground/80 leading-relaxed">
                                    <p>{t.about.description}</p>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.2}>
                                <div className="space-y-8">
                                    {skills.map((skillGroup) => (
                                        <div key={skillGroup.category}>
                                            <h3 className="text-sm font-mono text-emerald-400/80 mb-3">
                                                {skillGroup.category.toUpperCase()}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skillGroup.items.map(
                                                    (skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-3 py-1.5 text-sm bg-card-bg border border-card-border rounded-full text-foreground/80 hover:border-accent hover:text-accent transition-colors"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                <section id="projects" className="py-32 px-6 bg-card-bg/30">
                    <div className="max-w-6xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="gradient-text">/</span>{" "}
                                {t.projects.title}
                            </h2>
                            <p className="text-foreground/60 max-w-2xl mb-16">
                                {t.projects.subtitle}
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project, idx) => (
                                <AnimatedSection
                                    key={project.title}
                                    delay={idx * 0.1}
                                >
                                    <div
                                        className={`group relative h-full p-6 rounded-2xl bg-card-bg border border-card-border transition-all duration-300 card-hover gradient-border ${
                                            project.highlight
                                                ? "shadow-lg shadow-purple-500/10"
                                                : ""
                                        }`}
                                    >
                                        {project.highlight && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-foreground/60 text-sm mb-4 leading-relaxed">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.tech.map((tech, idx) => (
                                                <span
                                                    key={`${tech}-${idx}`}
                                                    className="px-2 py-1 text-xs font-mono text-foreground/40 bg-foreground/5 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="blog-preview" className="py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="gradient-text">/</span>{" "}
                                {t.blog.title}
                            </h2>
                            <p className="text-foreground/60 max-w-2xl mb-16">
                                {t.blog.subtitle}
                            </p>
                        </AnimatedSection>

                        <AnimatedSection delay={0.1}>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <article
                                        key={i}
                                        className="group p-6 rounded-2xl border border-card-border bg-card-bg hover:border-accent/50 transition-all duration-300 card-hover"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2 py-1 text-xs font-mono text-purple-400 bg-purple-400/10 rounded">
                                                Article
                                            </span>
                                            <span className="text-xs text-foreground/40">
                                                {i === 1 ? "2024" : "2023"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                                            {i === 1
                                                ? "Understanding Cross-chain Bridge Security"
                                                : "Building a DAO from Scratch"}
                                        </h3>
                                        <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                                            {i === 1
                                                ? "A deep dive into the security considerations and architectural patterns of cross-chain bridges..."
                                                : "Step-by-step guide to implementing a decentralized autonomous organization with voting mechanisms..."}
                                        </p>
                                        <Link
                                            href="/blog"
                                            className="text-sm text-accent hover:underline flex items-center gap-1"
                                        >
                                            Read more <ArrowRight size={14} />
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.3}>
                            <div className="mt-12 text-center">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-accent hover:underline"
                                >
                                    View all posts <ArrowRight size={16} />
                                </Link>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>

            <footer className="border-t border-card-border py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-foreground/40">
                        © 2024 Jun. {t.footer.builtWith}.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/joeyzone"
                            className="text-sm text-foreground/40 hover:text-accent transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="/blog"
                            className="text-sm text-foreground/40 hover:text-accent transition-colors"
                        >
                            Blog
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
