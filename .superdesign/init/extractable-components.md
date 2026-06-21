# Extractable Components

The following modules contain layout components that can be extracted as reusable UI chunks:

## Dashboard Header
- **Source**: `src/components/LayoutWrapper.tsx`
- **Category**: layout
- **Description**: Main app header with logo, navigation links, theme toggle, search, and notification indicators.
- **Extractable Props**: 
  - `activeNav` (string, default: "Dashboard")
  - `theme` (string, default: "dark")
  - `showAiAssistant` (boolean, default: true)
- **Hardcoded**: Logo initials, nav tabs labels ("Dashboard", "Leads ERP", etc.), search input design.

## Left Sidebar
- **Source**: `src/components/LayoutWrapper.tsx`
- **Category**: layout
- **Description**: Vertical sidebar containing navigation links organized under groups (Dashboard, Leads ERP, Team ERP, Social ERP, System).
- **Extractable Props**:
  - `activeNav` (string, default: "Dashboard")
- **Hardcoded**: Icon configurations, navigation label texts.

## Right AI CEO Widget
- **Source**: `src/components/LayoutWrapper.tsx`
- **Category**: layout
- **Description**: Sticky right drawer providing AI stats summaries (Good Morning Rohit, Today's Tasks progress, Strategist chat prompts).
- **Extractable Props**:
  - `showAiAssistant` (boolean, default: true)
- **Hardcoded**: Task percentages, mock strategies text, user name "Rohit".

## Portfolio Header
- **Source**: `src/components/PortfolioLanding.tsx`
- **Category**: layout
- **Description**: Large stacked serif name "ROHIT KUMAR" on the top left and navigation action "Leads ERP Console →" on the top right.
- **Extractable Props**: None (mostly static layout).
- **Hardcoded**: Text labels, styling.

## Portfolio Social Links
- **Source**: `src/components/PortfolioLanding.tsx`
- **Category**: layout
- **Description**: Solid SVG social icons (Instagram, X/Twitter, YouTube, LinkedIn) positioned on the bottom right.
- **Extractable Props**: None.
- **Hardcoded**: Solid SVG paths.
