# Design Brief: Conception Clinic

## Purpose
Reproductive health and fertility guidance platform offering evidence-informed preconception care, personalized assessment, and expert consultation for individuals and couples planning pregnancy.

## Tone & Aesthetic
Refined minimalism with organic warmth. Clinical authority balanced with human empathy. Professional healthcare aesthetic that feels accessible, never cold. Trustworthy, human-centered, wellness-focused.

## Differentiation
Warm sage-teal primary palette (representing growth and health) + cream backgrounds. Subtle botanical accent elements. Generous whitespace and human-scaled radii. Serif display font (Lora) for authority + clean sans-body (Inter) for accessibility creates sophisticated approachability.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Purpose |
|-------|-----------|-----------|---------|
| Primary | 0.45 0.12 185 | 0.65 0.1 185 | Sage-teal actions, links, primary UI |
| Secondary | 0.68 0.08 160 | 0.45 0.08 160 | Warm sage accent, secondary buttons |
| Accent | 0.52 0.14 165 | 0.65 0.1 165 | Highlights, active states, focus |
| Destructive | 0.58 0.2 22 | 0.65 0.18 22 | Alerts, deletions, warnings (warm red) |
| Muted | 0.92 0.01 250 | 0.22 0.01 250 | Disabled states, secondary text |
| Background | 0.98 0.01 250 | 0.13 0.01 250 | Cream light; deep cool dark |
| Foreground | 0.18 0.02 250 | 0.92 0.01 250 | Charcoal text; light text |
| Border | 0.91 0.02 250 | 0.27 0.01 250 | Subtle dividers, card edges |

## Typography
**Display (Lora):** Serif, 28–48px, used for headlines, clinic name, major section titles. Conveys trust and authority.
**Body (Inter):** Clean sans-serif, 14–16px. Accessible, professional, readable at all sizes. Primary text, labels, content.
**Mono:** System monospace for code/data display (rare in this domain).

## Structural Zones

| Zone | Treatment | Rationale |
|------|-----------|-----------|
| Header | `bg-card` + `border-b border-border` | Elevated, defined separation from content |
| Navigation | `text-foreground` + `hover:bg-muted/50` | Clean, subtle hover states |
| Hero Section | `bg-background` + subtle gradient accent on text | Warm, welcoming entry point |
| Content Cards | `bg-card` + `shadow-clinical` + rounded-lg | Layered hierarchy, soft elevation |
| CTA Buttons | `bg-primary` + `text-primary-foreground` + rounded-lg | Sage-teal for trust; rounded softness |
| Footer | `bg-muted/30` + `border-t border-border` | Subtle background, visual closure |

## Component Patterns
- **Buttons:** Primary (sage-teal), Secondary (warm sage), Outline (border + text), Disabled (muted).
- **Cards:** Rounded corners (0.75rem), `shadow-clinical`, padding 1.5rem, `bg-card`.
- **Forms:** Input borders in `border` color, focus ring in `accent`, labels in display font for section headers.
- **Navigation:** Responsive header with clinic logo in serif, top navigation, mobile hamburger menu.
- **Modals/Popovers:** Soft shadow (`shadow-elevated`), rounded, semi-transparent overlay.

## Motion & Interaction
- **Default transition:** `transition-smooth` (0.3s cubic-bezier for all interactive elements).
- **Page enters:** `fade-in` (0.4s) for content sections.
- **Button feedback:** Subtle scale transform on hover + color shift to secondary sage tone.
- **Form inputs:** Focus ring in accent color, smooth border transition.

## Responsive Design
Mobile-first. Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Generous touch targets (44px min). Stacked layout on mobile, multi-column on desktop.

## Spacing & Density
- **Sections:** 3rem gap (mobile: 2rem) for breathing room.
- **Card padding:** 1.5rem. Generous margins between cards.
- **Vertical rhythm:** 0.5rem baseline; multiples of 4px (4, 8, 12, 16, 24, 32).
- **Overall density:** Unhurried, dignified — whitespace as a design choice, not empty space.

## Constraints & Guardrails
- No generic tech blues or purple gradients; maintain warm, health-focused palette.
- Never use raw color literals; always use semantic tokens.
- Shadows are subtle clinical (not glow/neon). Elevation through layering and spacing, not dramatic effects.
- Serif only on headlines/display. Body always sans-serif for readability.
- Animation kept subtle; no bouncy or playful motion (clinical context).
- Dark mode intentionally designed, not just inverted lightness.
