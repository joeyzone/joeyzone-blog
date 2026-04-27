"use client";

import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
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
      <Navigation />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <motion.div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-mono text-purple-400">Blog</span>
                <span className="text-foreground/20">/</span>
                <span className="text-sm font-mono text-foreground/40">Posts</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">/</span> {t.blog.title}
              </h1>
              <p className="text-lg text-foreground/50">
                {t.blog.subtitle}
              </p>
            </motion.div>
          </AnimatedSection>

          <div className="space-y-8">
            {posts.map((post, idx) => (
              <AnimatedSection key={post.id} delay={idx * 0.05}>
                <Link href={`/blog/${post.id}`} className="block group">
                  <motion.article
                    className="p-8 md:p-10 rounded-3xl glass border border-white/5 hover:border-purple-500/30 transition-all duration-500 card-hover"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-foreground/50 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-foreground/40">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-purple-400 group/link">
                      <span className="text-sm font-medium">Read article</span>
                      <motion.span
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </div>
                  </motion.article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}