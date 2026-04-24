"use client";

import { use, useEffect, useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
};

function extractCodeFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractCodeFromChildren).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return extractCodeFromChildren((children as any).props?.children);
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
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-foreground/10 hover:bg-foreground/20 transition-colors group"
      title="Copy code"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} className="text-foreground/40 group-hover:text-foreground/70" />
      )}
    </button>
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
            <h1 className="text-3xl font-bold">Post not found</h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
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
                  <span className="text-sm font-mono text-purple-400">{post.date}</span>
                  <span className="text-sm text-foreground/30">•</span>
                  <span className="text-sm text-foreground/40">{post.readTime}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono text-foreground/40 bg-foreground/5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div className="prose prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-400 prose-headings:to-blue-400 prose-h1:text-5xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-foreground/60 prose-p:leading-loose prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-purple-400 prose-code:bg-foreground/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-pre:bg-[#1e1e1e] prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl prose-pre:relative prose-blockquote:border-l-purple-400 prose-blockquote:bg-foreground/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-ul:list-disc prose-ol:list-decimal max-w-none">
                {content && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt, ...props }) => {
                      if (!src) return null;
                      return <img src={src} alt={alt} className="rounded-lg shadow-lg my-8" {...props} />;
                    },
                    h1: ({ children }) => (
                      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold mt-16 mb-6 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-10 mb-4 text-foreground/90">
                        {children}
                      </h3>
                    ),
                    pre: ({ children }) => {
                      const code = extractCodeFromChildren(children);
                      return (
                        <pre className="bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl my-8 relative overflow-auto selection:bg-transparent">
                          {code && <CopyButton code={code} />}
                          {children}
                        </pre>
                      );
                    },
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;
                      if (isInline) {
                        return (
                          <code className="text-purple-400 bg-foreground/10 px-1.5 py-0.5 rounded font-normal" {...props}>
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
                            padding: "1.25rem",
                            background: "#1e1e1e",
                            fontSize: "0.875rem",
                            lineHeight: "1.7",
                          }}
                          codeTagProps={{
                            style: {
                              background: "transparent",
                            },
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-foreground/60 leading-loose mb-6">{children}</p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-400 bg-foreground/5 rounded-r-lg py-1 px-4 my-4 italic text-foreground/70">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
              </div>
            </article>
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}
