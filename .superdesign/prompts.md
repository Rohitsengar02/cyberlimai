# SuperDesign Prompts Library: 3D Animations & Hover Effects

Use the structured prompts in this file to iterate on your SuperDesign drafts or create new projects. Each prompt contains the visual directives, styling constraints, and fidelity flags needed for high-quality generations.

---

## 1. Hero Section: Gooey SVG Mask Reveal
**Use for**: Creating or tweaking the home screen image reveal effect.

```text
Iterate the hero section to implement an interactive gooey mask reveal effect.
- Stacking: Layer 1 (bottom) is the clean off-white background. Layer 2 is the normal portrait image (headshot_normal.png) centered and covering the entire screen. Layer 3 (top) is the creative/neon portrait image (headshot_creative.png) which is hidden by default.
- Interaction: Implement a custom SVG mask filter combining feGaussianBlur and feColorMatrix to generate a fluid, gooey white mask that tracks the cursor with a 12% linear interpolation lag (lerp).
- Trails: Create a particle queue that spawns smaller, shrinking, and fading circles along the mouse path. The speed of the cursor must determine the starting size of the trail circles (faster movements generate larger, more visible trails).
- Inversion: Place all text elements (Name, links, social icons) on the absolute top layer (z-index 20). As the gooey mask circle hovers underneath them, dynamically transition their text and fill colors to white over 300ms.
- Fidelity Constraint: Use ONLY the fonts, colors, spacing, and component styles defined in the design system. Do not introduce any fonts, colors, or visual styles not in the design system.
```

---

## 2. 3D Tilt Hover Cards (Feature / Projects Section)
**Use for**: Adding high-end 3D tilt effects to grid cards.

```text
Redesign the features/projects grid cards to add a responsive 3D tilt interaction.
- Structure: Create a 3-column grid of project cards with rounded-3xl corners, glassmorphic backdrops, and semi-transparent borders.
- Tilt Effect: On mouse move over any card, apply a CSS 3D transform combining perspective(1000px), rotateX, and rotateY based on the cursor's local coordinate relative to the card's center. The tilt must be smooth with a transition of transform 0.4s ease-out.
- Radial Hover Glow: Render an absolute positioned background gradient wrapper inside the card. Track the cursor's local coordinates to move a soft radial glow (cyan to purple, 20% opacity) that follows the pointer inside the card.
- Content Shift: Apply a subtle parallax translation to the text elements inside the card, making the title and badges float slightly forward (+10px Z-translate) relative to the card background.
- Fidelity Constraint: Use ONLY the fonts, colors, spacing, and component styles defined in the design system. Do not introduce any fonts, colors, or visual styles not in the design system.
```

---

## 3. Background: 3D Grid Mesh & Floating Waves
**Use for**: Enhancing background depth and responsive motion.

```text
Enhance the background layout with a subtle 3D animated mesh grid and floating waves.
- 3D Grid: Render a CSS background grid pattern styled with perspective(800px) rotateX(60deg) translating slowly along the Y-axis to simulate a floating ground plane.
- Responsive Waves: Draw 2 thin SVG bezier paths spanning the screen width. In the render loop, slightly distort their control coordinates based on the current mouse position (X and Y sways) to make the waves react dynamically to cursor movement.
- Color: Maintain the light off-white tone (opacity 10-15%) so the background elements remain extremely subtle and do not distract from the hero photography or text.
- Fidelity Constraint: Use ONLY the fonts, colors, spacing, and component styles defined in the design system. Do not introduce any fonts, colors, or visual styles not in the design system.
```

---

## 4. Full-Screen Page Transitions (Smooth 3D Slide)
**Use for**: Setting up transitions between the Portfolio page and the Leads ERP Console.

```text
Implement a smooth 3D page transition between the portfolio homepage and the dashboard view.
- Trigger: When the user clicks the "Leads ERP Console" action link, initiate a full-screen transition.
- Animation: Combine framer-motion page wrappers. The portfolio page should rotate slightly on the Y-axis and slide out to the left (transform: rotateY(-15deg) translateX(-100vw)), while the dashboard view slides in from the right with a spring transition (stiffness: 300, damping: 28).
- Glass Overlay: Show a brief frosted-glass overlay with an animated spinner during the transition route swap.
- Fidelity Constraint: Use ONLY the fonts, colors, spacing, and component styles defined in the design system. Do not introduce any fonts, colors, or visual styles not in the design system.
```
