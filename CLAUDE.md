# Smart AI Wardrobe Assistant

## Project Identity
AI-powered fashion recommendation and interactive wardrobe management application.

## Product Vision
A personalized digital stylist that helps users organize their wardrobe, mix & match outfits, and receive intelligent styling suggestions based on AI analysis.

## Core Features
1. **Style Persona Selection**: Onboarding flow with 36 curated style personas.
2. **Style DNA Analysis**: Semantic analysis of user style (percentages, radar charts, impressions).
3. **Personal Outfit Recommendation**: Semantic-driven recommendations (Daily, Urban, Active, etc.).
4. **Semantic Closet System**: Wardrobe organization based on style semantics (Clean, Soft, Urban).
5. **Outfit Compatibility Analysis**: AI-powered tool to check how new items fit the existing Style DNA.

## Technical Stack
- **Core**: Vite, React, TypeScript
- **Styling**: Design Token System (`src/styles/main.css`), Tailwind CSS
- **Design**: Minimalist High-Contrast Editorial Style (Bodoni Moda & Inter fonts)
- **Tooling**: Stitch (Initial UI/UX Design)

## Design System & Style Guide
- **Source of Truth**: [docs/STYLE_GUIDE.md](file:///d:/Intel_AI/fashion/docs/STYLE_GUIDE.md)
- **Primary Color**: #000000 (Ink)
- **Secondary Color**: #E5E2DD (Warm Cream)
- **Typography**: Bodoni Moda (Headlines), Inter (Body/Labels)
- **Aesthetic**: Magazine editorial feel, generous whitespace, rounded corners (8px).

## Folder Structure
- `docs/`: Design system, screen references, and project documentation.
- `src/`: Application source code.
  - `components/`: Reusable React components.
  - `screens_html/`: Original HTML references.
  - `styles/`: Global CSS and design tokens.

## Development Rules
- Follow "High-Contrast Editorial" design system.
- Prioritize mobile-first responsiveness.
- Use TypeScript for type safety.

## Karpathy Harness Rules
- Scoped validation before major changes.
- Minimalist implementation first.
- Goal-driven updates.
