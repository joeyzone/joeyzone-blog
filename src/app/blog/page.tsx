"use client";

import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/context";

const posts = [
  {
    id: 1,
    title: "Understanding Cross-chain Bridge Security",
    excerpt:
      "A deep dive into the security considerations and architectural patterns of cross-chain bridges, covering validation, finality, and trust models.",
    date: "2024",
    readTime: "10 min read",
    tags: ["Security", "Bridge", "Cross-chain"],
  },
  {
    id: 2,
    title: "Building a DAO from Scratch",
    excerpt:
      "Step-by-step guide to implementing a decentralized autonomous organization with voting mechanisms, token governance, and on-chain execution.",
    date: "2024",
    readTime: "15 min read",
    tags: ["DAO", "Governance", "Solidity"],
  },
  {
    id: 3,
    title: "Solidity Smart Contract Best Practices",
    excerpt:
      "Security patterns, gas optimization, and development workflow recommendations based on real-world smart contract development experience.",
    date: "2023",
    readTime: "12 min read",
    tags: ["Solidity", "Best Practices", "Security"],
  },
  {
    id: 4,
    title: "DeFi Protocol Mechanics Deep Dive",
    excerpt:
      "Understanding AMM algorithms, perpetual protocols, and liquidity mechanisms in decentralized finance.",
    date: "2023",
    readTime: "18 min read",
    tags: ["DeFi", "AMM", "Protocol"],
  },
  {
    id: 5,
    title: "WTF Solidity 贡献指南",
    excerpt:
      "How to contribute to the WTF Solidity open source project and help improve Solidity education for Chinese developers.",
    date: "2023",
    readTime: "5 min read",
    tags: ["WTF Solidity", "Open Source", "Tutorial"],
  },
];

export default function BlogPage() {
  const { messages } = useLanguage();
  const t = messages;

  return (
    <>
      <MouseFollower />
      <Navigation />

      <main className="flex-1 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">/</span> {t.blog.title}
            </h1>
            <p className="text-foreground/60 text-lg">
              {t.blog.subtitle}
            </p>
          </AnimatedSection>

          <div className="mt-12 space-y-6">
            {posts.map((post, idx) => (
              <AnimatedSection key={post.id} delay={idx * 0.05}>
                <article className="group p-6 rounded-xl border border-card-border bg-card-bg hover:border-purple-500/50 transition-all duration-300 gradient-border">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-xs font-mono text-purple-400">
                          {post.date}
                        </span>
                        <span className="text-xs text-foreground/30">•</span>
                        <span className="text-xs text-foreground/40">
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>
                      <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-mono text-foreground/40 bg-foreground/5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="shrink-0 flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Read <ArrowRight size={14} />
                    </Link>
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
