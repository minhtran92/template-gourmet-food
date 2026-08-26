# template-gourmet-food

F&B template — giao diện riêng cho shop đồ ăn/thức uống.

## Dev (clone là chạy được)

```bash
git clone https://github.com/minhtran92/template-gourmet-food.git
cd template-gourmet-food
npm install
npm run dev
```

Mở http://localhost:3001 → F&B storefront với mock data (6 món ăn + đồ uống).

## Cấu trúc

```
src/
├── app/                        ← Next.js App Router (dev sandbox)
│   ├── page.tsx                ← Render HomePage với mock tenant
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/pancake/sandbox/    ← Mock API (products)
│   │   └── products/route.ts
│   ├── shop/[slug]/
│   │   └── HomePage.tsx         ← F&B HomePage (exported)
│   └── theme.ts                 ← Colors, fonts
├── config.json                  ← Metadata
└── index.ts                     ← Package exports
```

## Template chỉ chứa giao diện

| Trong template | Trong main app (dùng chung) |
|---|---|
| HomePage (layout F&B) | Payment (VNPay/MoMo) |
| ProductCard (style F&B) | Cart logic (Zustand) |
| HeroBanner (F&B hero) | Checkout flow |
| ContentPage (layout) | Auth (OTP/OAuth) |
| Footer (F&B footer) | API client |

## Sửa giao diện

Chỉnh `src/app/shop/[slug]/HomePage.tsx` → `npm run dev` → xem ngay.
Theme colors: `src/app/theme.ts`.
