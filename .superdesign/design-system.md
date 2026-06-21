# Design System: Cyberleads & Portfolio

This document outlines the visual structure, layout conventions, and styling definitions for the Next Cyberleads project.

## 1. Product Context
- **Name**: Cyberleads ERP / Rohit Kumar Portfolio
- **Description**: High-end minimalist portal blending a personal interactive portfolio home screen with an AI-driven leads ERP SaaS platform.
- **Goal**: High-end editorial aesthetic with maximum interactive wow-factors (SVG gooey reveal masking, particle tracking, responsive sway paths).

## 2. Typography
- **Serif Font**: `Playfair Display` (represented by class `.font-serif-playfair` / CSS variable `var(--font-playfair)`). Used for editorial, high-impact headings, stacked names.
- **Sans-Serif Font**: `Geist` & `Inter` (represented by default sans-serif font stack). Used for UI controls, dashboard charts, cards text, and utility labels.

## 3. Brand Colors & Tokens
All colors are mapped to CSS variables in `globals.css`:
- **Light Theme Background**: `#f0f4ff` or `#f4f7fe`
- **Dark Theme Background**: `#050913`
- **Primary Color**: `rgb(37, 99, 235)` (Blue, `--color-primary-custom`)
- **Secondary Color**: `rgb(29, 78, 216)` (Dark Blue, `--color-secondary-custom`)
- **Accent Color**: `rgb(96, 165, 250)` (Light Blue, `--color-accent-custom`)
- **Card Backdrop (Glassmorphism)**: `rgba(255, 255, 255, 0.88)` (Light) / `rgba(10, 17, 36, 0.82)` (Dark), border radius `24px` with subtle transparent border.

## 4. UI Patterns & Animations
- **Blob Reveal Mask**: 
  - An organic, gooey SVG mask combining lagged coordinate tracking with trail coordinates.
  - Transition duration: `300ms` for color inversions.
  - Parallax factor: Text layers shift `1.0x` - `1.2x`, background media layers shift `0.4x` - `0.5x` in the opposite direction of mouse movement.
- **Background Wave Lines**: 
  - Thin paths drawing sways responding to cursor position coordinates.
