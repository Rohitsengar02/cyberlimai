# Shared UI Components

No standalone shared UI primitives (like Button.tsx, Input.tsx, Card.tsx) exist as separate files in this project. Primitives are constructed inline using standard HTML tag primitives and custom utility classes in `src/app/globals.css` combined with Tailwind classes.

## Primitives Styled Inline
- **Buttons**: Rendered using standard `<button>` tags with Tailwind CSS layout utilities (`px-4 py-2 rounded-xl bg-primary-custom hover:bg-blue-600 ...`).
- **Cards**: Styled using standard `div` wrappers with the `.glass-card` helper class defined in `globals.css` (provides backdrop-blur, semi-transparent border, shadow, and translateY transition lifts).
- **Icons**: Directly rendered using standard React wrappers from `lucide-react` or custom solid SVG paths.
