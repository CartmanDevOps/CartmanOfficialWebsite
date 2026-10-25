# Cartman PH — themes and readability update

Use **Theme** in the header to choose Charcoal, Balanced (50/50 green–black, default), or More green (70/30). The choice persists in this browser. This update also enlarges real interface text and controls, adds dedicated rider/merchant portraits with separate captions, and keeps the app preview flat and aligned while changing its content on every campaign slide. See [implementation notes and portrait prompts](source-assets/EXPERIENCE-UPDATE.md).

Latest update: charcoal buttons, ivory/stone surfaces, deeper jade accents, champagne details, the supplied real app icon, and five edited branded photographs. Riders now wear predominantly black uniforms; shirts and black delivery bags carry Cartman PH branding. See [brand assets and generation prompts](source-assets/BRAND-ASSETS.md). The local preview remains at the address below.

Open **http://localhost:4173**. Start or restart with `npm run dev` or `npm start`. No install is required. Set `PORT` to select another port. This iteration is local; it has not replaced the previously published private Site.

## What changed

- Full-width mint/emerald campaign hero, custom Filipino rider photograph, accessible slideshow, location entry, and a code-native app concept.
- Four photographic service cards, merchant/rider band, editorial delivery story, three-step explanation, app launch section, FAQ, and complete footer.
- Service-aware booking, itemized illustrative estimate, recipient validation, local drafts, persistent review, edit/back behavior, and unique booking references.
- Tracking with an explicitly illustrative route diagram, timeline, reference lookup, empty state, and unknown-reference state.
- Customer/rider/merchant login previews, password visibility, retained values on role changes, dashboard, and delivery history.
- Merchant/rider interest journeys, searchable help, support preview, launch interest, recovery, about, privacy, and terms.
- Responsive layouts, focus handling, skip link, Escape menu behavior, reduced-motion support, live status messages, and mobile input sizes that avoid automatic input zoom.

## Source

- `dist/index.html`: shell and loading hints.
- `dist/app.js`: shared state, icons, safe text output, routing, and form utilities.
- `dist/enhance.js`: page views and interaction handlers.
- `dist/styles.css`: shared base styles.
- `dist/premium.css`: refined components and responsive layouts.
- `dist/assets/`: optimized visitor assets.
- `source-assets/`: original logo and full-resolution generated image masters.
- `server.mjs`: loopback server with gzip, ETag/304 revalidation, HEAD, MIME types, and document-root checks.
- `output/`: screenshots and the previous deployment archive; that archive is not the current UI release.

## Live-launch scope

This is a frontend preview with local demo behavior. Authentication is not real; passwords are never saved. No payments, delivery dispatch, live GPS, support delivery, email subscriptions, or partner submissions are connected. Quotes, timelines, and maps are illustrative. Use sample details.

The privacy page clears Cartman demo profiles, bookings, drafts, review data, saved location, and interest/support entries. Roles are UI previews, not authorization. Live launch requires server authentication/authorization, an operational backend, real coverage/pricing, payment/dispatch integration, approved legal policies, and final contact information.

## Verification

`npm run check` checks the server and both application scripts. Browser checks covered 1440 px desktop, 390 px mobile, and 320 px narrow mobile; horizontal overflow; grocery selection and estimate (10 km = illustrative ₱169); draft restoration; review refresh; confirmation; tracking; account navigation; logout/login; retained role-switch inputs; password visibility; help filtering; and mobile merchant layout.

HTTP checks: home 200 with gzip, conditional request 304, hero HEAD 200/image-webp, missing resource 404. The rider hero is approximately 144 KB; service images are 45–82 KB; the original logo is optimized to approximately 18 KB. Below-fold images have lazy loading and explicit dimensions. PNG masters are outside the served folder.

## Asset generation briefs

All photographic assets used the built-in image generation tool. Final served WebP files are in `dist/assets/`; corresponding PNG masters are in `source-assets/`.

- **rider-hero.webp**: Premium 16:9 Philippine delivery commercial. Joyful Filipino courier in emerald/black riding jacket and green helmet on a stationary dark scooter with emerald delivery box, holding a phone, optimistic expression. Soft Manila-style skyline and tropical trees. Subject on right; airy pale mint negative space on left for HTML text. Morning sunlight, realistic commercial photography. No phone mockup, text, letters, logos, or watermark.
- **service-food.webp**: Grilled chicken rice bowl, jammy egg, tomatoes and greens, iced calamansi drink, kraft takeout container, cream backdrop. Individual 3:2 tabletop advertising photo, natural light, soft tropical greenery, no text/branding/watermark.
- **service-grocery.webp**: Emerald reusable tote with lettuce, carrots, tomatoes, bananas and glass milk bottle, sage backdrop. Same 3:2 tabletop photography treatment.
- **service-parcel.webp**: Three stacked kraft shipping boxes of varying sizes, subtle green tape, no labels, warm ivory backdrop. Same 3:2 tabletop photography treatment.
- **service-errands.webp**: Emerald shopping tote with kraft bag, coffee cup, wrapped bouquet and household package, mint backdrop. Same 3:2 tabletop photography treatment.
- **hero-delivery.webp** (retained): Filipino courier handing groceries to a customer at a neighborhood home, green scooter, tropical plants, golden afternoon light.
- **food-moment.webp** (retained): Filipino friends sharing pancit, chicken, rice and calamansi at home, kraft takeout packaging and green delivery bag.
- **parcel-moment.webp** (retained): Filipino merchant wrapping a kraft parcel with green ribbon in a bright neighborhood craft shop.

The supplied original logo remains in the navigation. Icons and the phone concept are SVG/HTML/CSS. The two screenshots supplied for this refinement guided the updated layout.

## Independent ordering app

Open `http://localhost:4173/order.html` for the standalone customer ordering demo. Landing-page Order online links open it in a separate tab. It includes local sample restaurants/stores, menus, searchable categories, basket and quantity controls, guest checkout, parcel/pabili requests, a local profile, order history, and simulated tracking. Demo data is stored only in this browser under `cm-order-` keys.

The landing page now features App Store and Google Play coming-soon badges. Real store URLs are required before enabling actual downloads. See `source-assets/ORDERING-DEMO.md` for implementation, validation, and generated-image prompts.

## White and Dark appearance

Use Theme on the landing page or Appearance in the ordering app. Both share the saved selection. White is the default; Dark uses black and graphite surfaces, white type, green accents and matching official brand artwork. Menu and service photos have dedicated dark versions. PNG masters and generation prompts are in source-assets/dark and source-assets/DARK-IMAGE-VARIANTS.json; served WebPs are in dist/assets/dark.
# Vercel deployment

Run `npm ci` and `npm run build` to validate and produce the optimized static site in `build/`. `dist/` remains the editable local preview. Production combines each page's styles and deferred scripts in their existing order, minifies them, and uses content hashes for bundle filenames. Source artwork and review output are excluded from Vercel uploads.

Run `npx vercel --prod` after signing in. `vercel.json` configures the static build output and asset cache headers. The landing page and independent `order.html` demo are both included. First-time visitors see Dark mode; saved White/Dark preferences remain respected. The ordering system is still a browser-local demo.

To inspect the production build locally in PowerShell, set `$env:STATIC_DIR='build'` and `$env:PORT='4180'`, then run `node server.mjs`.

Motion uses a self-hosted Lenis 1.3.27 browser build on marketing pages for fine-pointer wheel input. Touch scrolling and the ordering app remain native. Reduced-motion preferences disable smoothing and reveal effects. The vendored MIT license is in dist/assets/vendor/lenis-LICENSE.txt; update that browser build alongside the npm dependency.
