# Nike Retail Design System

A photography-first commerce system built on extreme typographic contrast: towering uppercase display lockups burned into editorial campaign imagery, sitting above a dense, near-monochrome retail chrome of pill-shaped black CTAs, gray search and filter pills, and flat 8px-grid product cards. Pure black, pure white, one soft gray, and a deliberately small set of semantic accents — every chromatic moment is reserved for photography or a pricing signal, never for decorative chrome.

## Sources

| Source | Access | Notes |
|---|---|---|
| `uploads/DESIGN-nike.md` | In this project | The **only** source. A design.md-format extraction (front-matter tokens + prose) covering `/men`, a trail-running listing (`/w/mens-acg-trail-running-shoes-…`), the ACG Zegama PDP (`/t/acg-zegama-…`), `/membership`, and a Jordan Golf listing. |
| Codebase | Not provided | No repository or local folder was attached. |
| Figma | Not provided | No file or link was given. |
| Image / font / logo assets | Not provided | No binaries of any kind were supplied — see § Substitutions. |

Everything in this system is derived from that single markdown file. Where the file is silent (marked "Known Gaps" in it and below), this system is silent too rather than inventing a pattern.

## Index

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import` list only |
| `tokens/fonts.css` | Substituted webfont loading + family tokens |
| `tokens/colors.css` | Base palette + semantic aliases |
| `tokens/typography.css` | Sizes, weights, leading, composed `--type-*` shorthands |
| `tokens/spacing.css` | 8px scale + layout tokens |
| `tokens/radius.css` | Radius scale + semantic aliases |
| `tokens/elevation.css` | Three elevation levels, focus ring, press motion |
| `tokens/base.css` | Body reset and link colours |
| `guidelines/*.card.html` | 20 foundation specimen cards (Colors, Type, Spacing, Shape, Brand) |
| `components/<group>/` | 20 React primitives — see below |
| `ui_kits/retail-web/` | Four-screen click-through recreation of the retail web surfaces |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent Skills wrapper for use in Claude Code |

### Components

| Group | Components |
|---|---|
| `components/brand/` | **Wordmark** |
| `components/buttons/` | **Button**, **IconButton**, **FilterChip** |
| `components/forms/` | **SearchPill** |
| `components/icons/` | **Icon** |
| `components/media/` | **Photo** |
| `components/product/` | **ProductCard**, **PriceRow**, **PromoBadge**, **SwatchDots** |
| `components/content/` | **CampaignTile**, **CategoryIconCard**, **MemberBenefitCard**, **DisclosureRow** |
| `components/navigation/` | **UtilityBar**, **PrimaryNav**, **SubNav**, **FilterSidebar**, **SiteFooter** |

Every family above has a counterpart in the source's `components:` front matter. **Intentional additions** (four, each because the source describes the thing but names no component):

- **Icon** — the source references magnifier, chevron, heart, bag and paddle glyphs but ships no icon set; this is the single wrapper through which all glyphs are drawn (substituted Lucide, stroke 1.5).
- **Photo** — the source's whole visual language is photography on a soft-cloud stage; no imagery was supplied, so this is the honest placeholder every image passes through.
- **Wordmark** — no logo asset was supplied, so the brand name is set in plain type wherever a mark would go. **Nothing was drawn, reconstructed or approximated.**
- **PriceRow** / **PromoBadge** / **SwatchDots** are split out of the source's `product-card` spec because it defines them as separately styled sub-entries.

### UI kits

- `ui_kits/retail-web/` — men's landing, product listing, product detail, membership. Fully navigable (`index.html`).

No slide template was provided, so no sample slides exist. No mobile app surfaces were provided, so no app kit exists.

---

## Content Fundamentals

**Vibe.** Athletic, kinetic, absolute. Copy behaves like a coach, not a salesperson: short, imperative, present-tense. The display tier is a slogan, not a sentence — 2–4 words, often broken across lines for rhythm ("RUN / THE / LINE"). The chrome tier is purely functional catalogue language.

**Casing.** Campaign headlines are **uppercase**, always. Section headers are title case ("Trending Now", "Featured Footwear", "Shop by Sport", "Latest in Clothing"). Product names use the product's own casing ("ACG Zegama", "Pegasus Trail 5 GORE-TEX"). Nothing else is uppercased — no all-caps buttons, no all-caps labels.

**Person.** The brand speaks in the imperative with an implied "you": "Add to Bag", "Notify Me", "Become a Member", "Join Us", "Explore". First person appears only from the user's side ("Favourites", "My Bag"). It never says "we".

**Sentence length.** Body copy runs one or two short sentences per block and stops. Product descriptions state construction and purpose in that order — "Built for steep, loose and technical ground. A rock plate underfoot and aggressive lugs keep you steady." Membership copy states the benefit then the condition: "Free shipping. On every order, no minimum spend."

**Buttons and links.** Verb-first, 1–3 words: "Add to Bag", "Shop", "Explore", "Sign In", "Notify Me", "Join Us". Never "Click here", never "Learn more about…". Disclosure rows are noun phrases ("View Product Details", "Shipping & Returns", "Reviews (128)"). Counts sit in parentheses.

**Metadata voice.** Product subtitles are literal category strings: "Men's Trail Running Shoes", "Men's Running Top". Colour counts read "4 Colours". Sale copy reads "29% off" — lowercase "off", no exclamation.

**Punctuation & symbols.** Utility links are separated by a pipe or middot ("Find a Store | Help | Join Us | Sign In"); breadcrumbs use " / ". Ampersands are used freely in nav ("New & Featured", "Shipping & Returns"). No exclamation marks. No ellipses in CTAs.

**Emoji: never.** Not in nav, not in badges, not in body copy. Emotion is carried by photography and type scale.

## Visual Foundations

**Colour.** Three values carry ~95% of the chrome: `--ink` `#111111`, `--canvas` `#ffffff`, `--soft-cloud` `#f5f5f5`. Text steps down through `--charcoal` → `--ash` → `--mute` → `--stone`. Two dividers only: `--hairline` `#cacacb` for 1px rules, `--hairline-soft` `#e5e5e5` for inset edges. Semantic colour is rationed: `--sale` red on price rows *only*, `--success` for stock/confirmation, `--info` for member callouts. The six category accents (pink, soft pink, soft purple, pale purple, teal, deep pink) are for swatch dots, soft editorial tile fills and collection moments — never chrome, never text, never a CTA.

**Type.** One display voice and one UI voice, with nothing in between: 96px/0.9 uppercase campaign lockups, then a 32 → 24 → 16 → 14 → 12 → 9px functional ladder. Letter-spacing is 0 throughout (a −0.5% correction is applied only to the substitute display face). The missing 48–64px tier is deliberate: billboard above, catalogue below.

**Spacing.** 8px base — 2 / 4 / 8 / 12 / 18 / 24 / 30 / 48. Sections stack at 48px (32px tablet, 24px mobile). Grid gutters are 8px. Product cards have **zero** internal padding; metadata rows sit 8px apart directly beneath a full-bleed image. Content max-width ~1440px, outer gutters growing to ~80px at 1920px. PLP filter rail is a fixed 220px.

**Whitespace philosophy.** Whitespace separates; it does not decorate. Sections butt against each other on the 48px rhythm with no dividers between them — the bleed edge of a photograph *is* the divider. Headlines sit immediately above their content with no decorative air.

**Backgrounds.** Flat white, flat soft-cloud, flat ink, or full-bleed photography. **No gradients. No textures. No patterns. No hand-drawn illustration.** The only "image treatment" is art-direction cropping (16:9 or 21:9 desktop hero → 4:5 mobile crop).

**Imagery vibe.** Two distinct registers. Product: shot flat on `--soft-cloud`, evenly lit, no background depth, 1:1 or 4:5 — the product is the only form on the page. Editorial: cinematic, high-contrast, atmospheric, cool-to-neutral grade, real athletes in real environments, framed with burn-in space at lower- or upper-left for the headline. No grain, no duotone, no colour overlay except the deepest editorial tint (`--accent-pink-deep`) used as a wash on heritage tiles.

**Corner radii.** Containers are square (0px): cards, tiles, nav, footer, product images, sidebars. Pills are 30px: every CTA, filter chip, promo badge. Search is 24px. Dots and circular icon buttons are fully round. Avatars/icon containers in member lockups are 18px. There is no 4px or 8px radius anywhere in this system.

**Cards.** Flat. No shadow, no border, no radius, no padding. A product card is a photograph with text under it. A campaign tile is a photograph with type inside it. A member benefit card is a dark photograph with type and a white pill at its bottom-left.

**Elevation & shadow.** Three levels total: flat (default), 1px `--hairline` divider (filter rows, footer, disclosure rows), and `inset 0 -1px 0 --hairline-soft` on sticky bars and tab strips. **No drop shadows exist in the retail chrome.** Depth comes from photography, never from CSS.

**Borders.** Used only where a line is doing real work: hairline row dividers, the 1px hairline on default filter chips and promo badges, a 1px ring on light colourway swatches so they stay visible on white, a 2px ink border on a focused search pill, a 2px ink underline under the active nav item, a 1px ink underline under a selected filter option.

**Transparency & blur.** Effectively absent. No frosted panels, no translucent overlays, no backdrop blur. Type placed on photography is full-opacity white or full-opacity ink chosen per asset for legibility — the system does **not** dim images behind text or add protection gradients or capsules. (If an asset can't carry legible type, the asset is re-cropped, not scrimmed.)

**Hover states.** The source documents none — Nike's own CSS exposes `--pds-color-element-hover` / `--pds-color-text-hover` but the values were not captured. Treat hover as a **known gap**: this system ships no hover styling beyond the global link colour shift in `tokens/base.css`. Do not invent one; ask before adding.

**Press state.** The one signature interaction: the surface collapses — `opacity: 0.5` with a scale-down — on pointer-down (`--press-opacity`, `--press-scale`, 120ms). The source records `scale(0.5)`; components ship a restrained `scale(0.96)` so demos read correctly. Restore the literal value if you need exact fidelity.

**Focus.** One ring: white fill, 2px `--ink` border, and a 12px `--soft-cloud` outer halo (`--focus-ring`) — a soft glove rather than a hard outline. Radius stays at 24px on the search pill.

**Animation.** Minimal by intent. No entrance animations, no parallax, no bounce, no scroll-triggered reveals. Only the press collapse and the search-pill width transition, both ~120–150ms with a standard ease.

**Layout rules.** Utility bar (36px) is always present and never collapses. Primary nav (56px) is static, not sticky, in the captured surfaces; PLP sub-nav is sticky with the inset hairline edge. One primary black pill per fold — if a second is needed, neutralise it to secondary or the on-image white pill. Never two campaign lockups at the same scale in one row: a full-bleed editorial tile always alternates with a 2-, 3- or 4-up grid.

## Iconography

- **No Nike icon assets were supplied** — no icon font, no SVG sprite, no PNG set. The source only names the glyphs in use: magnifier, wishlist heart, bag, hamburger, chevron (up/down/left/right), carousel paddles, share, back arrow, filter/sort controls.
- **Substitution (flagged):** [Lucide](https://lucide.dev) at **stroke 1.5**, loaded from CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.js`), drawn through the single `Icon` component. Lucide's thin, geometric, open-terminal outline style is the closest freely available match to Nike's utility chrome. Every icon in this system is therefore a stand-in, not the brand's real glyph.
- **Style rules regardless of set:** monochrome `--ink` (or `--canvas` on dark), outline not filled, 18–24px in chrome, 20px inside a 40px circular button, never coloured, never used decoratively beside a heading.
- **Illustration.** The source describes illustrated ~80px category glyphs in the "Latest in Clothing" strip. Those illustrations were not supplied and have **not** been redrawn; `CategoryIconCard` renders a substituted Lucide glyph on a soft-cloud circle and accepts an `image` prop for the real artwork.
- **Emoji: never used.** Unicode characters are used as *typography*, not as icons: the pipe `|` between utility links, the slash `/` in breadcrumbs, a middot in fine print.
- **No logo, no swoosh.** No mark was provided; none has been drawn or approximated. `Wordmark` sets the brand name in plain uppercase type as a placeholder. Drop the licensed SVG at `assets/logo.svg` and replace that component's body.

## Substitutions — please replace

1. **Fonts.** Nike Futura ND, Helvetica Now Display Medium, Helvetica Now Text / Text Medium and Neue Frutiger Arabic are proprietary and were not supplied. Following the source's own guidance, `tokens/fonts.css` loads **Bebas Neue** for the display tier and **Inter** 400/500 for everything else, from Google Fonts. **No font binaries ship in this project.** Send the licensed `.woff2` files and I will move them into `assets/fonts/` with real `@font-face` rules.
2. **Icons.** Lucide, stroke 1.5 (see § Iconography).
3. **Imagery.** Zero image assets. Every image is a captioned `Photo` placeholder that names the crop it expects.
4. **Logo.** None supplied, none drawn.

## Known Gaps

Carried forward from the source, plus what could not be derived:

- **Hover states** — not documented; none shipped.
- **Mobile surfaces** — no mobile screenshots; the responsive rules in the source are synthesised from desktop evidence. No mobile UI kit was built for that reason.
- **Dialogs / modals** — only the geo-selector pill pair is described; bag, wishlist and login overlays are undocumented and therefore absent.
- **Form fields** — only the search pill exists. Checkout, sign-up and address field styling is unknown; do not infer it from the search pill without asking.
- **Bag / wishlist filled-count variants** — not visible in the captured pages. `PrimaryNav` ships a minimal ink count badge as the smallest reasonable reading of the source; confirm before relying on it.
- **Dark mode** — not documented beyond the inverse text and success/sale "deep" values.
- **Slide template** — none provided, so no deck sample slides exist.
