# Page Component Dependencies

Use this mapping as the source of truth for context files required when designing.

## `/` (Home Page)
- **Entry**: `src/app/page.tsx`
- **Dependencies**:
  - `src/components/PortfolioLanding.tsx`
  - `src/app/globals.css`
  - `src/app/layout.tsx`

## `/dashboard` (Dashboard ERP Page)
- **Entry**: `src/app/dashboard/page.tsx`
- **Dependencies**:
  - `src/components/LayoutWrapper.tsx`
    - `src/components/MainDashboard.tsx`
    - `src/components/LeadsDashboard.tsx`
  - `src/app/globals.css`
  - `src/app/layout.tsx`

## `/leads-management` (Leads ERP Management Page)
- **Entry**: `src/app/leads-management/page.tsx`
- **Dependencies**:
  - `src/components/LayoutWrapper.tsx`
    - `src/components/LeadsDashboard.tsx`
    - `src/components/MainDashboard.tsx`
  - `src/app/globals.css`
  - `src/app/layout.tsx`
