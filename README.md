# @g66studio/template-gourmet-food

F&B (Food & Beverage) template for multi-tenant e-commerce platform.

## Quick Start (Sandbox)

```bash
git clone https://github.com/minhtran92/template-gourmet-food.git
cd template-gourmet-food
npm install
cd sandbox && npm install && cd ..
npm run dev
```

Open http://localhost:3001 to see the F&B storefront.

## Structure

- `src/` — Published package (theme, pages, components)
- `sandbox/` — Next.js dev app with mock data (NOT published)

## Template Features

- F&B-specific HomePage (menu categories + dish cards + hero)
- Warm coffee/wood color palette
- Products fetched from `/api/pancake/[slug]/products` (mock in sandbox)
- All colors from `theme.colors.*` (theme switching changes layout)
