# Cartman PH UI/UX MVP

Run `npm run dev`, then open http://127.0.0.1:4173. No install step is required. The deployable static site is in `dist/`. Run `npm run check` for JavaScript syntax validation.

## Included

Responsive marketing page, three-image campaign carousel with pause and reduced-motion support, services, how it works, booking with illustrative pricing and review, local confirmation and reference tracking, login/signup with customer/rider/merchant roles, recovery preview, account dashboard, rider/merchant interest forms, support, launch interest, about, and prototype privacy/terms.

All functional data stays in browser localStorage. No password is saved. Authentication, payments, rider dispatch, GPS, notifications, submitted applications, and support delivery require backend integration before public launch. Demo data can be cleared from the privacy page.

## Assets

`dist/assets/cartman-logo.png` is the supplied original brand reference. The UI uses a compact vector brand interpretation, inline stroke service icons, and `favicon.svg`. Campaign photographs were generated with the built-in image generation tool and optimized to WebP. Original PNG masters are retained in the same folder.

The two requested UI screenshots were missing at their supplied download paths, so their exact layouts could not be extracted. The supplied logo informed the green/black palette and brand direction.

### Campaign prompts (built-in image generation)

1. **hero-delivery** — Premium photorealistic wide Filipino delivery commercial: friendly courier in emerald green polo and helmet handing a kraft grocery bag with fresh greens and oranges to a smiling Filipino woman outside a warm cream neighborhood home, green scooter and delivery box, tropical plants, golden afternoon light, authentic joyful connection, no text or logos.
2. **food-moment** — Premium wide lifestyle campaign: three Filipino friends sharing pancit, grilled chicken, rice and calamansi from kraft takeout containers at a cozy modern apartment table, emerald delivery bag, warm sunlight, candid laughter, no text or logos.
3. **parcel-moment** — Premium wide local business campaign: cheerful Filipino merchant in sage apron wrapping a kraft parcel with green ribbon at a wooden craft-shop counter, cream shelves, green delivery bag, tropical plants, warm natural sunlight, no text or logos.

For a future video hero, replace the image element inside `.hero-media` with a muted looping inline video and preserve the poster, gradient, campaign text, and accessible pause control.

## Validation

Browser verification covers the landing page, booking estimate/review/confirmation/tracking, account flow, responsive layout, and generated asset loading. Hosting uses `.openai/hosting.json` and a buildless static deployment.
