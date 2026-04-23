"use client";

import Navigation from "@/components/Navigation";
import MouseFollower from "@/components/MouseFollower";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/i18n/context";

const skills = [
  { category: "Smart Contracts", items: ["Solidity", "OpenZeppelin", "Hardhat", "WTF Solidity", "Ethers.js"] },
  { category: "Blockchain", items: ["Polkadot", "Substrate", "EVM", "Cross-chain Bridges", "Solana"] },
  { category: "DeFi Protocols", items: ["DEX", "MakerDAO", "Uniswap V3", "Perpetuals", "Lending"] },
  { category: "Frontend & Tools", items: ["React", "TypeScript", "Vue", "Node.js", "Docker"] },
];

const workExperience = [
  {
    key: "deepsafe",
    projects: [
      "Cross-chain bridge development",
      "Polkadot parachain module development",
      "MakerDAO Gov integration",
      "Aero DEX protocol implementation",
      "BTC stablecoin and crowdfunding contracts",
    ],
  },
  {
    key: "web3nomad",
    projects: [
      "CDU project full-stack development",
      "Setllaris Inscription contracts",
      "JYZ DAO (Token, signatures, voting)",
      "Scroll cross-chain bridge (ETH Hackathon)",
      "IPFS-based medical data storage",
    ],
  },
  {
    key: "bitmart",
    projects: [
      "Exchange frontend from 0 to 1",
      "Frontend architecture and security",
      "Internal tooling systems",
    ],
  },
];

export default function AboutPage() {
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
              <span className="gradient-text">/</span> {t.about.title}
            </h1>
            <p className="text-foreground/60 text-lg">{t.about.subtitle}</p>
          </AnimatedSection>

          <div className="mt-16 space-y-16">
            <AnimatedSection delay={0.1}>
              <section>
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {t.about.description}
                </p>
              </section>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <section>
                <h2 className="text-xl font-semibold mb-6 text-purple-400">
                  {t.about.skills}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map((group) => (
                    <div key={group.category} className="p-6 rounded-xl border border-card-border bg-card-bg">
                      <h3 className="font-mono text-emerald-400/80 text-sm mb-4">{group.category.toUpperCase()}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-sm bg-foreground/5 border border-foreground/10 rounded-full text-foreground/70"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <section>
                <h2 className="text-xl font-semibold mb-6 text-purple-400">
                  {t.about.experience}
                </h2>
                <div className="space-y-6">
                  {workExperience.map((exp) => {
                    const work = t.work[exp.key as keyof typeof t.work];
                    return (
                      <div key={exp.key} className="p-6 rounded-xl border border-card-border bg-card-bg gradient-border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">{work.title}</h3>
                          <span className="text-sm text-foreground/40 font-mono">{work.period}</span>
                        </div>
                        <p className="text-sm text-emerald-400/80 mb-4">{work.role}</p>
                        <ul className="space-y-2">
                          {exp.projects.map((p, i) => (
                            <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <section>
                <h2 className="text-xl font-semibold mb-6 text-purple-400">
                  {t.about.education}
                </h2>
                <div className="space-y-4">
                  <div className="p-6 rounded-xl border border-card-border bg-card-bg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{t.education.zju.title}</h3>
                        <p className="text-sm text-emerald-400/80">{t.education.zju.degree} · {t.education.zju.major}</p>
                      </div>
                      <span className="text-sm text-foreground/40 font-mono">{t.education.zju.period}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-xl border border-card-border bg-card-bg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{t.education.neu.title}</h3>
                        <p className="text-sm text-emerald-400/80">{t.education.neu.degree} · {t.education.neu.major}</p>
                      </div>
                      <span className="text-sm text-foreground/40 font-mono">{t.education.neu.period}</span>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedSection>
          </div>
        </div>
      </main>
    </>
  );
}
