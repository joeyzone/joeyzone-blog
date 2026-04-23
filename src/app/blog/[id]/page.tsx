"use client";

import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  return (
    <>
      <MouseFollower />
      <Navigation />

      <main className="flex-1 pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <article>
              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-sm font-mono text-purple-400">2024</span>
                  <span className="text-sm text-foreground/30">•</span>
                  <span className="text-sm text-foreground/40">10 min read</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  Understanding Cross-chain Bridge Security
                </h1>
                <div className="flex flex-wrap gap-2">
                  {["Security", "Bridge", "Cross-chain"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono text-foreground/40 bg-foreground/5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div className="prose prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-accent prose-strong:text-foreground prose-code:text-purple-400 prose-code:bg-foreground/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none">
                <p>
                  Cross-chain bridges are critical infrastructure in the Web3 ecosystem,
                  enabling the transfer of assets and data between different blockchain
                  networks. However, they also represent one of the most significant
                  security challenges in the space.
                </p>

                <h2>Trust Models</h2>
                <p>
                  Different bridge architectures employ different trust models. Some
                  rely on centralized validators, while others use distributed networks
                  with economic guarantees. Understanding these models is crucial for
                  assessing bridge security.
                </p>

                <h2>Validation Mechanisms</h2>
                <p>
                  The validation of cross-chain transactions requires careful consideration
                  of finality, consensus mechanisms, and the economic cost of attacks.
                  A well-designed bridge should minimize trust assumptions while
                  maintaining efficiency.
                </p>

                <h2>Common Attack Vectors</h2>
                <p>
                  Bridge hacks have resulted in billions of dollars in losses. Common
                  attack vectors include smart contract exploits, oracle manipulation,
                  and consensus attacks. This post examines several notable incidents
                  and the lessons learned.
                </p>

                <h2>Best Practices</h2>
                <p>
                  When building or using cross-chain bridges, consider factors such as
                  multi-sig requirements, time locks, and emergency pause mechanisms.
                  User education and clear risk disclosure are also essential.
                </p>

                <h2>Conclusion</h2>
                <p>
                  Cross-chain bridge security is an evolving field. As the ecosystem
                  matures, we can expect more robust architectures and better
                  security practices to emerge.
                </p>
              </div>
            </article>
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}
