# CLAUDE.md

## Project Overview

This is a personal portfolio and technical blog website for a Web3 / smart contract engineer named **Joeyzone**.

The website is used to present:

- Personal profile
- Web3 engineering experience
- Smart contract / DeFi / DAO / cross-chain projects
- Technical blog posts
- Interview and engineering notes

The site should feel like a professional Web3 engineer portfolio, not a generic personal homepage.

---

## Design Direction

Keep the visual style consistent:

- Dark Web3 interface
- Blue / purple neon accents
- Pixel-art logo and icons
- Subtle cyberpunk atmosphere
- Smart contract / blockchain / DeFi engineering identity
- Clean portfolio layout
- Technical but polished

Avoid making the site too colorful, cartoonish, game-like, or overly decorative.

---

## Color Rules

Use a dark background as the base.

Recommended colors:

```css
--bg-main: #05060a;
--bg-panel: #0b0c14;
--bg-card: rgba(18, 16, 28, 0.82);

--primary-purple: #8b5cf6;
--primary-blue: #3b82f6;
--cyan: #38bdf8;
--green: #00f5a0;

--text-main: #f8fafc;
--text-muted: #9ca3af;
--text-dim: #6b7280;

--border-purple: rgba(139, 92, 246, 0.35);
--border-soft: rgba(255, 255, 255, 0.08);
```

Color usage:

- Purple and blue are the main accent colors.
- Green is only used for status labels such as `Available for work`, `deployed`, or `Smart Contract Engineer`.
- Orange should be used very sparingly and mainly inside pixel-art assets.
- Avoid large areas of bright green Matrix-style animation.
- Avoid rainbow gradients.

---

## Layout Rules

Use a consistent centered container across all major sections.

```css
.container {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 24px;
}
```

The following sections should align to the same left and right boundaries:

- Hero
- About
- Projects
- Blog
- Footer

Avoid random left offsets or elements floating outside the main layout unless they are very subtle background decorations.

---

## Navbar

The navbar should be a floating glassmorphism-style bar.

Requirements:

- Fixed or sticky near the top
- Centered with the same max width as the page container
- Dark translucent background
- Purple-blue subtle border
- Rounded corners
- Slight blur
- No heavy shadow
- No oversized logo

Recommended style:

```css
.navbar {
    max-width: 1180px;
    height: 56px;
    margin: 12px auto 0;
    padding: 0 18px;
    border-radius: 18px;
    background: rgba(8, 10, 18, 0.78);
    border: 1px solid rgba(139, 92, 246, 0.25);
    backdrop-filter: blur(18px);
}
```

Navbar rules:

- Do not let the navbar overlap or hide the Hero title.
- If the navbar is fixed, add enough top padding to Hero or main content.
- Logo area should only contain pixel icon + `joeyzone`.
- Do not duplicate logo blocks.
- Navigation items should stay simple: `Home`, `About`, `Projects`, `Blog`.

---

## Hero Section

The Hero section is the most important part of the homepage.

Preferred layout:

- Left side: text content
- Right side: portrait / Web3 visual
- Dark background
- Subtle grid / neon / geometric effects
- No text covering the portrait's face

Hero content should include:

- Status pill: `Smart Contract Engineer · Available for work`
- Main title: `Hi, I'm Joeyzone`
- Subtitle: `Web3 Developer`
- Role line: `Solidity Smart Contract Engineer`
- Short description
- CTA buttons: `Learn More`, `View Blog`
- Social links: `GitHub`, `Telegram`

Hero rules:

- The title must never be covered by the navbar.
- The text should align with the global container.
- The portrait should be visible but not overpower the text.
- The portrait opacity can be around `0.65–0.75`.
- Add subtle blue-purple glow behind the portrait.
- Remove meaningless floating icons such as isolated circular `N` decorations.
- Do not reintroduce full-screen Matrix code rain unless it is very subtle and masked away from the center content.

---

## Matrix / Cyber Animation Rules

If a Matrix-style animation is used:

- It must be subtle.
- Opacity should usually be between `0.08` and `0.22`.
- It should not cover the hero title, portrait face, CTA buttons, or important text.
- It should be masked toward the edges.
- Green should be slightly cyan-tinted, not pure bright green.

Recommended style:

```css
.matrix-rain {
    opacity: 0.16;
    mix-blend-mode: screen;
    mask-image: radial-gradient(
        ellipse at center,
        transparent 0%,
        transparent 35%,
        black 70%,
        black 100%
    );
}
```

For Next.js / React:

- Any animation using `window`, `document`, `canvas`, `requestAnimationFrame`, `useEffect`, or `useRef` must be inside a client component.
- Add `"use client"` at the top of that component.
- Browser APIs must be used inside `useEffect`.
- Always clean up animations with `cancelAnimationFrame`.

Correct animation ref pattern:

```tsx
"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} />;
}
```

---

## About Section

The About section should communicate engineering credibility.

It should include:

- Short personal description
- Technical focus
- Stats cards
- Skill cards

Stats examples:

- `3+ Years`
- `8+ Projects`
- `50+ Contracts`
- `∞ Security Mindset`

Skill cards:

- Smart Contracts
- Blockchain
- Protocols
- Frontend

Tags can include:

- Solidity
- Hardhat
- OpenZeppelin
- EVM
- Substrate
- Polkadot
- DeFi
- MakerDAO
- React
- TypeScript

Rules:

- Do not make skill cards too small.
- Text must be readable.
- Tags should be concise.
- Use icons consistently.

---

## Projects Section

Projects should feel technical and Web3-specific.

Main projects:

1. Cross-chain Bridge
2. DEX Protocol
3. DAO Governance

Each project card should include:

- Pixel-style icon
- Project category badge
- Terminal-style metadata
- Title
- Description
- Tech tags

Recommended badges:

- Cross-chain Bridge: `Multi-chain`
- DEX Protocol: `Protocol`
- DAO Governance: `Governance`

Terminal metadata example:

```txt
// role: lead_engineer
// stack: solidity / hardhat / ethers
// status: deployed
```

Rules:

- Keep all project cards visually consistent.
- Do not use emoji-style icons.
- Use pixel-art or neon-style icons.
- `status: deployed` should use green accent.
- Avoid overloading the card with too much text.

---

## Blog Section

The Blog section should present technical depth.

Preferred layout:

- Left: Featured Article
- Right: Recent Notes list

Featured article example:

```txt
MakerDAO Governance: From Voting to Spell Execution
```

Recent note examples:

```txt
Understanding EVM Opcodes
Cross-chain Messaging Protocols
Substrate Runtime Development
Uniswap V2 Math Notes
EIP-712 Signature Deep Dive
Delegatecall and Proxy Upgrade Risks
AMM Slippage and MEV Notes
```

Blog card rules:

- Keep titles technical and specific.
- Use tags such as `EVM`, `Gas`, `Cross-chain`, `Governance`, `DeFi`.
- Add date and reading time when possible.
- Do not leave large empty spaces inside cards.

---

## Content Tone

The writing style should be:

- Technical
- Clear
- Concise
- Engineering-focused
- Not overly marketing-driven

Preferred identity terms:

```txt
Smart Contract Engineer
Web3 Developer
Protocol Builder
Security-minded Developer
```

Avoid vague phrases such as:

```txt
Passionate dreamer
Creative explorer
Blockchain enthusiast
Future innovator
```

Use concrete engineering descriptions instead.

---

## Blog Writing Style

Technical blog posts should use Markdown.

Preferred structure:

```markdown
# Title

## 1. Background

## 2. Core Concepts

## 3. Formula / Mechanism

## 4. Contract-Level Details

## 5. Security Considerations

## 6. Interview Notes

## 7. Summary
```

For math-heavy posts, use LaTeX:

```markdown
$$
x \cdot y = k
$$
```

For Solidity examples:

```solidity
function example() external {}
```

For interview notes, use concise bullet points.

---

## Code Quality Rules

When editing code:

- Keep TypeScript strict-mode compatible.
- Avoid `any` unless necessary.
- Keep components small and readable.
- Avoid large duplicated JSX blocks.
- Use constants for repeated content such as projects, skills, and blog posts.
- Prefer mapping over arrays for repeated UI cards.
- Keep styles consistent.
- Do not introduce unnecessary dependencies.

For Next.js:

- Use `"use client"` only where needed.
- Keep static content as server components when possible.
- Client components should only be used for animations or interactions.
- Avoid using browser APIs outside `useEffect`.

---

## Deployment Rules

The project must build successfully on Vercel.

Before finishing changes, ensure:

```bash
npm run build
```

passes without TypeScript or ESLint errors.

Common issues to avoid:

- `useRef<number>()` without initial value
- Direct use of `window` or `document` during server rendering
- Missing dependencies such as `framer-motion`
- Invalid image imports
- Hydration mismatch caused by random values during SSR

Correct `useRef` pattern:

```tsx
const animationRef = useRef<number | null>(null);
```

---

## Asset Rules

Use local assets from the project when possible.

Preferred asset types:

- Pixel logo
- Pixel favicon
- Pixel project icons
- Web3 portrait background
- Neon abstract background images

Asset style should remain consistent:

- Pixel art
- Neon blue / purple
- Dark background
- Web3 / blockchain / smart contract symbols

Avoid:

- Emoji icons
- Random stock illustrations
- Inconsistent 3D icons
- Bright white backgrounds
- Text embedded inside background images when used as UI assets

---

## Accessibility

Maintain basic accessibility:

- Buttons and links should have clear labels.
- Text contrast must be readable.
- Avoid tiny unreadable text.
- Do not rely on color only to convey status.
- Images should have meaningful `alt` text.
- Interactive elements should have hover and focus states.

---

## Responsive Design

The site must work well on:

- Desktop
- Tablet
- Mobile

Mobile rules:

- Hero should stack vertically.
- Text should remain readable.
- Navbar should not overflow.
- Project cards should become single-column.
- Blog layout should become single-column.
- Large decorative images should not push content off-screen.

---

## Do Not Do

Do not:

- Change the site into a generic SaaS landing page.
- Replace the Web3 / pixel / neon identity.
- Add too many colors.
- Add large green Matrix rain over the main content.
- Put text over the portrait face.
- Use emoji as final project icons.
- Make the navbar cover the hero title.
- Randomly change spacing in only one section.
- Add heavy animations that hurt performance.
- Introduce dependencies unless clearly needed.
- Ignore TypeScript build errors.

---

## Final Quality Checklist

Before completing a UI change, check:

- [ ] Does the page still feel like a Web3 smart contract engineer portfolio?
- [ ] Are the colors mainly dark + blue/purple neon?
- [ ] Is green used only as a small status accent?
- [ ] Is the Hero title readable and not covered?
- [ ] Is the portrait visible but not overpowering?
- [ ] Are all sections aligned to the same container?
- [ ] Are cards visually consistent?
- [ ] Are project icons consistent pixel-style assets?
- [ ] Does the site build successfully?
- [ ] Does the mobile layout still work?

---

## Current Visual Identity Summary

The final direction should be:

> A dark, polished Web3 personal blog for a smart contract engineer, combining pixel-art branding, blue-purple neon accents, subtle cyber visuals, and technical content presentation.

## Blog Content Management Workflow

When creating or editing a technical blog post, Claude must also update the related site metadata and UI display automatically.

A blog post is not considered complete if only the Markdown file is created. Claude must check and update all relevant blog listing, homepage preview, intro, and metadata files.

### Blog File Rules

Blog posts should be stored as Markdown or MDX files according to the current project structure.

Before creating a new post, inspect the project and identify the actual blog content directory, such as:

- `content/blog/`
- `src/content/blog/`
- `posts/`
- `src/posts/`
- `app/blog/`
- `src/app/blog/`

Do not assume the path blindly. Use the existing structure of the project.

New blog file names should use kebab-case.

Examples:

- `uniswap-v2-math-notes.md`
- `uniswap-v3-math-notes.md`
- `aave-interest-rate-model.md`
- `eip-712-signature-deep-dive.md`

Avoid file names like:

- `UniswapV2.md`
- `uniswapv2.md`
- `My Blog.md`

### Blog Frontmatter Rules

Each blog post should include complete frontmatter if the project supports frontmatter.

Preferred format:

title: "Uniswap V2 Math Notes"
slug: "uniswap-v2-math-notes"
description: "A concise technical note on Uniswap V2 constant product AMM, swap formulas, LP shares, TWAP, flash swaps, and impermanent loss."
date: "2026-04-27"
category: "DeFi"
tags:

- Uniswap
- AMM
- DeFi
- Solidity
- Math
  readingTime: "18 min read"
  featured: false
  published: true

Rules:

- `title` should be clear and technical.
- `slug` should match the file name.
- `description` should be 1-2 sentences and suitable for homepage/blog cards.
- `date` should use `YYYY-MM-DD`.
- `tags` should be specific and technical.
- `readingTime` should be estimated based on article length.
- `featured` should only be true for one or very few important articles.
- `published` should be true unless the user explicitly asks for a draft.

### Automatic Homepage Update Rules

When a new blog post is created, Claude must check whether the homepage contains a blog preview section.

Possible files include:

- `src/app/page.tsx`
- `app/page.tsx`
- `src/components/BlogSection.tsx`
- `src/components/HomeBlog.tsx`
- `src/data/blogs.ts`
- `src/lib/blog.ts`
- `src/config/blog.ts`

Claude must update the homepage blog preview if the project uses static blog data.

The homepage blog section should show:

- A featured article
- Recent technical notes
- Blog title
- Blog description / intro
- Tags, date, and reading time if already supported

If the homepage already reads blog metadata dynamically from Markdown files, Claude should not duplicate the data manually. Instead, ensure the new Markdown frontmatter is complete so the homepage updates automatically.

### Blog Page Update Rules

When a new blog post is created, Claude must check and update the blog index page.

Possible files include:

- `src/app/blog/page.tsx`
- `app/blog/page.tsx`
- `src/pages/blog.tsx`
- `src/components/BlogList.tsx`
- `src/data/blogs.ts`
- `src/lib/blog.ts`

The blog page should include the new post in the correct order.

Default ordering:

1. Published posts first
2. Newest date first
3. Featured posts may be pinned if the existing UI supports it

If the blog list is generated dynamically from files, Claude should ensure the new post frontmatter contains all required fields.

If the blog list uses a static array, Claude must add the new post to that array.

### Blog Intro Update Rules

When adding a new blog post, Claude should update relevant intro text if needed.

Homepage blog intro should describe the overall blog direction, for example:

"Technical notes on smart contracts, DeFi protocols, AMM math, cross-chain infrastructure, and Web3 security."

Blog page intro should be broader, for example:

"A collection of engineering notes covering Solidity, EVM internals, DeFi protocol design, AMM mathematics, governance, cross-chain systems, and security patterns."

Do not rewrite intro text every time unless the new post expands the content direction significantly.

For example:

- Adding `uniswap-v2-math-notes.md` can strengthen the DeFi / AMM wording.
- Adding `aave-interest-rate-model.md` can strengthen the lending protocol wording.
- Adding `substrate-runtime-development.md` can strengthen the cross-chain / runtime wording.

### Featured Article Rules

Only one article should usually be featured on the homepage.

When adding an important long-form article, Claude may suggest making it featured, but should avoid changing the featured article without clear reason.

Default featured priority:

1. Deep protocol analysis
2. Math-heavy DeFi notes
3. Security or architecture articles
4. Short notes should usually remain in Recent Notes

Examples of good featured articles:

- `MakerDAO Governance: From Voting to Spell Execution`
- `Uniswap V2 Math Notes`
- `Uniswap V3 Concentrated Liquidity Math`
- `Aave Interest Rate Model`

### Recent Notes Rules

Recent Notes should contain shorter or more focused technical posts.

Good examples:

- `EIP-712 Signature Deep Dive`
- `Delegatecall and Proxy Upgrade Risks`
- `AMM Slippage and MEV Notes`
- `Understanding EVM Opcodes`
- `Cross-chain Messaging Protocols`

When adding a new blog post, Claude should decide whether it belongs in:

- Featured Article
- Recent Notes
- Full Blog List only

Do not overcrowd the homepage.

The homepage should show only a small curated subset. The blog page should show all posts.

### Blog Card Metadata Rules

Every blog card should ideally show:

- Title
- Short description
- Category
- Tags
- Date
- Reading time
- Optional featured badge

Descriptions should be concise and technical.

Example:

Title:
`Uniswap V2 Math Notes`

Description:
`A formula-focused review of constant product AMMs, swap pricing, LP shares, TWAP, flash swaps, and impermanent loss.`

Tags:
`DeFi`, `AMM`, `Uniswap`, `Math`

### After Creating a Blog Post

After writing a new blog post, Claude must perform this checklist:

- [ ] Create the Markdown or MDX blog file.
- [ ] Add complete frontmatter metadata.
- [ ] Check whether blog metadata is generated dynamically or stored in a static data file.
- [ ] Update static blog data if required.
- [ ] Update homepage blog preview if required.
- [ ] Update blog index page if required.
- [ ] Ensure the new article appears in the proper category.
- [ ] Ensure homepage Featured / Recent Notes still look balanced.
- [ ] Ensure intro text remains accurate.
- [ ] Run or recommend `npm run build`.
- [ ] Fix TypeScript, Markdown, or routing errors before finishing.

### Blog Writing Quality Rules

Technical blog posts should be useful for future interview review and engineering reference.

The preferred style is:

- Formula-first
- Mechanism-first
- Clear definitions
- Practical contract-level notes
- Interview summary at the end
- Avoid vague marketing language
- Avoid unnecessary beginner explanations if the topic is advanced

For DeFi math posts, include:

- Parameter definitions
- Core formulas
- Step-by-step derivations
- Examples
- Contract implementation notes
- Common interview questions
- Summary formula table

For smart contract posts, include:

- Core concept
- Solidity / EVM mechanism
- Security risks
- Attack scenarios
- Best practices
- Interview notes

### Blog Routing Rules

If the project uses dynamic routing, Claude must ensure the new blog slug works.

Possible routes:

- `/blog/uniswap-v2-math-notes`
- `/posts/uniswap-v2-math-notes`

Claude should check the existing routing pattern before adding links.

Do not create links to routes that do not exist.

### Build Safety Rules for Blog Changes

When adding Markdown or MDX content:

- Do not use unescaped JSX-sensitive characters in MDX.
- Escape underscores in LaTeX text when needed.
- Prefer display math with `$$ ... $$`.
- Avoid broken nested code fences.
- Avoid raw HTML unless the project already supports it.
- Ensure frontmatter syntax is valid YAML.
- Ensure all imported components exist.
- Ensure `npm run build` passes.

Common LaTeX compatibility rules:

- Use `\text{MINIMUM\_LIQUIDITY}` instead of `\text{MINIMUM_LIQUIDITY}`.
- Use `reserveFactor` in formulas instead of `reserve_factor` if underscores cause rendering problems.
- Prefer simple formulas when Markdown math rendering is unstable.
