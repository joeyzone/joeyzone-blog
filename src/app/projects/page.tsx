"use client";

import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/context";

const projects = [
    {
        id: 1,
        title: "Cross-chain Bridge",
        category: "Infrastructure",
        description:
            "Built cross-chain bridge projects supporting multiple chains including Bitlayer, Taker, B², AINN, CKB, SatoshiVM, Fractal, Duckchain and more. Integrated with various DeFi protocols.",
        tech: ["Substrate", "Solidity", "Bridge", "Polkadot"],
        github: "https://github.com/joeyzone",
        demo: "https://deepx.fi",
        highlight: true,
    },
    {
        id: 2,
        title: "DEX Protocol",
        category: "DeFi",
        description:
            "Responsible for the development and maintenance of the DEX public chain project’s lending and insurance fund modules, including Substrate framework customization and on-chain logic implementation.",
        tech: ["Solidity", "Uniswap V3", "DeFi", "EVM"],
        github: "https://github.com/joeyzone",
        demo: "https://testnet.deepx.fi",
        highlight: true,
    },
    {
        id: 4,
        title: "CDU Project",
        category: "Full-stack",
        description:
            "Full-stack blockchain project with AMM mechanics, token minting, and airdrop distribution. Deployed on BSC.",
        tech: ["Solidity", "BSC", "React", "Node.js"],
        github: "https://github.com/joeyzone/CDU",
        demo: "https://cdu-technology.github.io",
        highlight: false,
    },
    {
        id: 5,
        title: "Scroll Cross-chain Bridge",
        category: "Infrastructure",
        description:
            "ETH Hackathon project - a cross-chain bridge connecting Ethereum and Scroll. Won recognition for innovative bridge design.",
        tech: ["Solidity", "Scroll", "Bridge", "ETH"],
        github: "https://github.com/joeyzone/scroll-mini-bridge",
        demo: "https://scroll-bridge-frontend.vercel.app",
        highlight: false,
    },
    {
        id: 6,
        title: "Medical Data Storage",
        category: "Research",
        description:
            "IPFS-based distributed medical data storage solution. Research project supported by Zhejiang Provincial Science Department.",
        tech: ["IPFS", "Solidity", "Storage", "Research"],
        github: "https://github.com/joeyzone/medrc",
        demo: "",
        highlight: false,
    },
];

export default function ProjectsPage() {
    const { messages } = useLanguage();
    const t = messages;

    return (
        <>
            <MouseFollower />
            <Navigation />

            <main className="flex-1 pt-24 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">/</span>{" "}
                            {t.projects.title}
                        </h1>
                        <p className="text-foreground/60 text-lg max-w-2xl">
                            {t.projects.subtitle}
                        </p>
                    </AnimatedSection>

                    <div className="mt-16 grid md:grid-cols-2 gap-8">
                        {projects.map((project, idx) => (
                            <AnimatedSection
                                key={project.id}
                                delay={idx * 0.05}
                            >
                                <article
                                    className={`group relative h-full p-8 rounded-2xl border transition-all duration-300 gradient-border ${
                                        project.highlight
                                            ? "bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/30"
                                            : "bg-card-bg border-card-border"
                                    }`}
                                >
                                    {project.highlight && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-2 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded">
                                                Featured
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <span className="text-xs font-mono text-purple-400/70 uppercase tracking-wider">
                                            {project.category}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                                        {project.title}
                                    </h2>

                                    <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 text-xs font-mono text-foreground/40 bg-foreground/5 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                            Source
                                        </a>
                                        {project.demo && (
                                            <a
                                                href={project.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                Demo
                                            </a>
                                        )}
                                    </div>
                                </article>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
