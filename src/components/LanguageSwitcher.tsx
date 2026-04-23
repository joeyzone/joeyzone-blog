"use client";

import { useLanguage } from "@/i18n/context";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-background/50 border border-card-border rounded-lg p-1">
      <button
        onClick={() => setLocale("zh")}
        className={`px-2 py-1 text-xs font-mono rounded transition-all ${
          locale === "zh"
            ? "bg-accent text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        中
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 text-xs font-mono rounded transition-all ${
          locale === "en"
            ? "bg-accent text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
