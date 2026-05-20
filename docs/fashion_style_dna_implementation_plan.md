# Implementation Plan - Fashion Style DNA System

## Overview
Re-planning the application to follow the **Fashion Style DNA System Flow** based on the provided document. The application will center around understanding user style semantics and building a digital "Style DNA".

## Core Flow Refactoring
1.  **Step 01: Style Persona Selection**
    *   Implement a new onboarding flow where users select from 36 curated personas.
    *   Assets from `d:\Intel_AI\fashion\fasion 36 image list\List_up` will be used.
2.  **Step 02: Style DNA Analysis**
    *   Generate a "DNA" report including style percentages (e.g., Sportive Casual 72%).
    *   Implement a perception radar chart (Comfort, Clean, Urban, etc.).
    *   Display "Impression Keywords".
3.  **Step 03: Personal Outfit Recommendation**
    *   Recommend outfits based on the user's semantic profile.
    *   Scenarios: Daily, Commute, Active, Date.
4.  **Step 04: Semantic Closet System**
    *   Refactor the wardrobe view to group items by semantics (Clean, Soft, Urban) instead of category.
5.  **Step 05: Outfit Compatibility Analysis**
    *   Interactive tool to check how a new item fits the existing Style DNA.

## Technical Tasks

### 1. Asset Management
- [ ] Copy 36 persona images to `public/personas/`.
- [ ] Create a `PERSONA_DATA` constant with names, categories, and tags.

### 2. UI/UX Refinement
- [ ] Maintain the "High-Contrast Editorial" and "Quiet Luxury" aesthetic.
- [ ] Use `Bodoni Moda` for headlines and `Inter` for body text.
- [ ] Transitions using `motion/react`.

### 3. Component Updates
- [ ] `PersonaSelection.tsx`: Swipe/Grid selection for 36 personas.
- [ ] `StyleDNAReport.tsx`: Radar chart and DNA breakdown.
- [ ] `SemanticCloset.tsx`: Categorized wardrobe view.
- [ ] `MatchAnalyzer.tsx`: Compatibility tester.
- [ ] `App.tsx`: Refactor navigation to follow the new flow.

### 4. Logic Implementation
- [ ] Implement a basic "Style Embedding" logic (mocked for now) that maps selections to semantic scores.
- [ ] Update `UPDATE_LOG.md` and `CLAUDE.md`.

## Success Criteria
- [ ] 36 personas are selectable.
- [ ] Radar chart displays correct semantic dimensions.
- [ ] Wardrobe is organized by "Style Semantics".
- [ ] App follows the new 5-step flow.
