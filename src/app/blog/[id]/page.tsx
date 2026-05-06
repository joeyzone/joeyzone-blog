"use client";

import { use, useEffect, useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Calendar, Clock, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";

const posts: Record<number, {
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}> = {
  1: {
    title: "Exploring DAO Governance",
    date: "2024",
    readTime: "8 min read",
    tags: ["DeFi", "DAO", "MakerDAO"],
    slug: "makerdao",
  },
  2: {
    title: "Uniswap V2 Math Formulas and Core Mechanisms",
    date: "2024",
    readTime: "12 min read",
    tags: ["DeFi", "AMM", "Uniswap"],
    slug: "uniswapv2",
  },
  3: {
    title: "Uniswap V3 Math Formulas and Core Mechanisms",
    date: "2024",
    readTime: "15 min read",
    tags: ["DeFi", "AMM", "Uniswap"],
    slug: "uniswapv3",
  },
  4: {
    title: "Aave Interest Rate Model",
    date: "2024",
    readTime: "10 min read",
    tags: ["DeFi", "Lending", "Aave"],
    slug: "aave",
  },
};

function extractCodeFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractCodeFromChildren).join("");
  }
  if (children && typeof children === "object") {
    // Handle react-markdown v9 node structure
    const node = children as { props?: { children?: React.ReactNode }; value?: string };
    if (node.props?.children) {
      return extractCodeFromChildren(node.props.children);
    }
    if (typeof node.value === "string") {
      return node.value;
    }
    return "";
  }
  return "";
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <motion.button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2.5 rounded-xl glass hover:bg-white/10 transition-all group"
      title="Copy code"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <Check size={16} className="text-emerald-400" />
      ) : (
        <Copy size={16} className="text-foreground/40 group-hover:text-foreground/70" />
      )}
    </motion.button>
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = posts[Number(id)];

  const [content, setContent] = useState("");

  useEffect(() => {
    if (post?.slug) {
      fetch(`/content/${post.slug}.md`)
        .then((res) => res.text())
        .then(setContent);
    }
  }, [post?.slug]);

  if (!post) {
    return (
      <>
        <Navigation />
        <main className="flex-1 pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </AnimatedSection>
            <h1 className="text-3xl font-bold">Post not found</h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground mb-8 transition-colors group"
            >
              <motion.span
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft size={16} className="inline mr-1" />
              </motion.span>
              Back to Blog
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <article>
              {/* Header */}
              <header className="mb-16">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      <Tag size={12} className="mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="gradient-text">{post.title}</span>
                </motion.h1>

                <motion.div
                  className="flex items-center gap-6 text-sm text-foreground/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="w-px h-4 bg-foreground/20" />
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </motion.div>
              </header>

              {/* Content */}
              <motion.div
                className="prose prose-invert prose-lg max-w-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    img: ({ src, alt }) => (
                      <motion.img
                        src={src}
                        alt={alt}
                        className="rounded-2xl shadow-2xl my-10 border border-white/5"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold mt-16 mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold mt-16 mb-6 text-foreground flex items-center gap-3">
                        <span className="text-purple-500">//</span> {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-10 mb-4 text-foreground/90">
                        {children}
                      </h3>
                    ),
                    pre: ({ children }) => {
                      const code = extractCodeFromChildren(children);
                      const cleanCode = typeof code === 'string' ? code.trim() : code;
                      return (
                        <motion.div
                          className="code-block my-8 rounded-2xl overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {cleanCode && <CopyButton code={cleanCode} />}
                          {children}
                        </motion.div>
                      );
                    },
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;

                      // Extract string content from children (handles react-markdown v9 node structure)
                      const getStringContent = (node: React.ReactNode): string => {
                        if (typeof node === "string") return node;
                        if (Array.isArray(node)) return node.map(getStringContent).join("");
                        if (node && typeof node === "object" && "props" in node) {
                          return getStringContent((node as any).props?.children);
                        }
                        return String(node);
                      };

                      const codeString = getStringContent(children).replace(/^[\u2018\u2019\u201a\u201b\u0027']+/, '').trim();

                      if (isInline) {
                        return (
                          <code className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg font-mono text-sm">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: "1.5rem",
                            background: "#0d0d0f",
                            fontSize: "0.875rem",
                            lineHeight: "1.7",
                            borderRadius: "0",
                          }}
                          codeTagProps={{
                            style: {
                              background: "transparent",
                            },
                          }}
                        >
                          {codeString.replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-foreground/60 leading-loose mb-6 text-lg">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <motion.blockquote
                        className="border-l-4 border-purple-500 bg-purple-500/5 rounded-r-2xl py-4 px-6 my-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="text-foreground/60 italic">{children}</div>
                      </motion.blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-3 text-foreground/60 mb-6">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-3 text-foreground/60 mb-6">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-foreground font-semibold">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => <hr className="my-12 border-white/5" />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </motion.div>

              {/* Footer navigation */}
              <motion.div
                className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to all posts</span>
                </Link>
              </motion.div>
            </article>
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}