"use client";

import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/context";

const posts: Array<{
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}> = [
  {
    id: 1,
    title: "Exploring DAO Governance",
    excerpt: "Deep dive into MakerDAO governance: voting process, smart contracts and execution mechanism",
    date: "2024",
    readTime: "8 min read",
    tags: ["DeFi", "DAO", "MakerDAO"],
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
                <Link href={`/blog/${post.id}`} className="block">
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
                          {post.title}
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
                      <span className="shrink-0 flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
