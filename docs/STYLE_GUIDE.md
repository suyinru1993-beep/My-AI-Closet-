# STYLIST AI: Style Guide & UI Protocol

## Overview
This document defines the common UI patterns and design standards for the **Stylist AI** application. The design follows a *High-Contrast Editorial* aesthetic, blending luxury fashion magazine vibes with minimalist digital utility.

## 🎨 Color Palette
- **Primary**: `#000000` (Ink) - Used for primary actions, branding, and high-hierarchy text.
- **Secondary Container**: `#E5E2DD` (Warm Cream) - Used for active nav states, section backgrounds, and highlighting.
- **Surface**: `#F9F9F9` (Paper) - Main page background.
- **Lowest Surface**: `#FFFFFF` - Card backgrounds and input fields.
- **Accents**:
  - **Sage**: `#8BA88E` (Success/Match)
  - **Ocher**: `#D4A373` (Warning/Low Match)

## ✍️ Typography
- **Headlines (Bodoni Moda)**:
  - Display Large: `48px / 56px`, 600 weight, -0.02em tracking.
  - Headline Large: `32px / 40px`, 500 weight.
  - Headline Medium: `24px / 32px`, 500 weight.
- **Functional (Inter)**:
  - Body Medium: `16px / 24px`, 400 weight.
  - Label Medium: `14px / 20px`, 600 weight, uppercase, 0.05em tracking.
  - Label Small: `12px / 16px`, 500 weight.

## 📐 Spacing System (Stack)
- **Unit**: 8px
- **Stack SM**: 16px (element gaps)
- **Stack MD**: 32px (section gaps)
- **Stack LG**: 64px (major component separation)
- **Mobile Padding**: 20px
- **Desktop Padding**: 48px

## 💎 Component Standards
### Buttons
- **Primary**: Pill-shaped, black background, white text. Bold tracking.
- **Secondary**: Pill-shaped, cream background, dark text.
- **Icon Buttons**: Size 24px, Material Symbols Outlined.

### Navigation
- **Top Bar**: Centered logo "STYLIST AI", fixed height approx 64px.
- **Bottom Bar**: Persistent mobile navigation, rounded top corners (12px), background `#F9F9F9`. Active icons highlighted with cream container.

### Cards & Imagery
- **Aspect Ratios**: 4:5 for clothing items, 1:1 for thumbnails.
- **Rounding**: `0.5rem` (Cards) to `1rem` (Large Sections).
- **Shadows**: Extremely soft ambient shadows (opacity 0.04).

## 🛠️ Implementation
All styles are centralized in `src/styles/main.css` using CSS Variables. Avoid using ad-hoc hex codes in components; always reference the design tokens.
