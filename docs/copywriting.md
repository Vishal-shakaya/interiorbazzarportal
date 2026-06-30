# 03 — Copywriting

The Portal's voice. Every string a user reads — headline, CTA, hint, error, empty state — follows
these rules. Extracted from the prototype's real copy.

---

## 1. Voice & tone

**Interior bazzar sounds measured, specific, and trustworthy — never hyped.** It earns belief with
concrete facts (qualified enquiries, 4-hour replies, manual verification, exclusive routing), not
adjectives. It is India-first and quietly confident.

Three registers, same voice:
- **Buyer-facing** — approachable, solution-focused ("Find your match").
- **Seller-facing** — data-backed, ambitious ("attract. qualify. convert.").
- **Institutional** — plain, compliant, human ("We read every note").

Evidence (verbatim):
- "Where design *businesses* find their next client."
- "…connects interior designers, architects, showrooms and retailers with people actively looking for
  them — through qualified enquiries, not noise."
- "Routed exclusively to {seller}. They typically respond within 4 hours."
- "Manual verification, always"
- "You're in. Welcome to Interior bazzar. Your account is verified and ready. The process starts now."

### Mechanics
- **Brand name:** lowercase b — **"Interior bazzar"** (never "Interior Bazzar" / "BAZZAR") in body copy.
- **Spelling:** British/Indian English — **"enquiry"** (never "inquiry"/"lead"), "catalogue", "personalise".
- **Punctuation:** clean. Em-dashes to expand an idea. **No exclamation marks** in CTAs or hero copy.
- **Italics:** sparingly, for a single emphasised keyword (*businesses*, *believe in*, *discovery problem*).
- **Case:** Title Case for primary headings; sentence case for subheads; UPPERCASE letter-spaced for
  section eyebrows (e.g. "attract · qualify · connect"). CTAs are Title Case — **never ALL CAPS**.
- **Rhythm:** short, punchy. Noun-first step labels ("Contact", "Project", "Timeline") or verb-first
  actions. Lead with specifics, not superlatives.

---

## 2. Vocabulary (preferred → avoided)

| Use | Not | Why |
|-----|-----|-----|
| enquiry | inquiry, lead | brand/British; "lead" is growth-hack speak |
| qualified | quality, hot | the core differentiator word |
| verified / manually verified | certified, approved | trust marker the platform owns |
| Connect | Contact us, Get in touch | action over passive |
| exclusive routing / routed exclusively | broadcast, blast | one enquiry → one seller |
| studio / showroom / shop | brand, vendor | how the trade refers to itself |
| catalogue | lookbook, PDF | trade term |
| homeowner / buyer / seller / interior professional | customer, client, user | role-specific framing |
| plans | pricing, packages, tiers | product name for subscriptions |
| portfolio · reviews | gallery · testimonials (in-product) | seller trust anchors |

Plan names are **branded, not generic**: Autogrowth (Launch/Scale/Dominance), Business
(Verified/Trusted/Industry Leader), Shop (Verified/Plus/Pro), Architecture (Verified/Plus/Pro). Never
"Basic/Pro/Premium".

Qualifier adjectives for enquiries: *genuine, motivated, ready, serious* — never "cheap" or price-led
(price is explicitly **not** a qualifier in this brand).

---

## 3. CTA library (use these exact strings)

**Discovery / browse:** "Explore now" · "Find designers near me" · "Browse more products" · "Get catalogue" · "Play all"

**Connect / enquire:** "Connect" · "Send enquiry" · "Send query" · "Continue" · "Verify phone" ·
"Visit the showroom" · "Request a callback" · "Check availability" · "Book a consultation"

**Auth:** "Continue with Email" · "Continue with Phone" · "Sign in" · "Sign up" · "Verify & continue" ·
"Complete registration" · "Go to home" · "Send reset code" · "Sign in now"

**Seller / plans:** "List my business" · "View plans" · "Get Verified" · "Get Scale" · "Get Shop Pro"
(pattern: **"Get {Tier}"**) · "Change plan" · "Send request"

**Dashboard (buyer):** "Enquire" · "Share list" · "Export" · "Start browsing" · "Upgrade plan"

**Dashboard (seller):** "Respond" · "Accept" · "Decline" · "Message" · "View all" · "Add product" ·
"Create shop" · "Add project" · "Move to next stage" · "Mark as won" · "Create quotation" · "Send quotation"

**Feedback / legal:** "Share your experience" · "Send feedback" · "Read the full disclaimer"

> Rule: **no bare verb buttons** ("View", "Browse", "Shop" alone). Every CTA is action+object, or a
> noun that implies action in context. Every CTA points to the next journey step ([modules-features-flow.md](modules-features-flow.md)).

---

## 4. Microcopy patterns

**Confirmations** — gratitude/reassurance + a concrete timeline:
- "Routed exclusively to {seller}. They typically respond within 4 hours."
- "Your question is sent to {seller}. Expect a reply within 2 hours."
- "Thank you, {first name}. You've helped shape what Interior bazzar becomes next."

**Placeholders** — real-looking, India-first:
- email "you@example.com" · phone "98765 43210" · brief "Tell us a bit about the space or what you have
  in mind (optional)" · note "Anything else? (optional)" · feedback "Tell us in your own words…"

**Hints / reassurance** — privacy and process, plainly:
- "OTP-verified · we never share your number"
- "A request does not charge you. Billing is settled with our team after approval."
- "By continuing you agree to our Terms of Service and Privacy Policy. Interior bazzar serves India and
  international markets — your data is handled per applicable law."

**Errors** — short, human, fixable:
- "Enter a valid email address" · "Incorrect password. Try again." · "Passwords don't match" ·
  "Code expires in {timer}"

**Empty states** — name the emptiness, then offer the next step:
- "No enquiries yet" → "Start browsing" · "Nothing saved yet" → "Start browsing" · "No products found".

**Password rules** — shown as a live checklist (and announced, see a11y): "At least 8 characters",
"One uppercase letter", "One number", "One special character (!@#$…)".

**Form labels** — "Full name" · "Email address" · "Mobile number" (not "phone") · "Preferred OTP delivery".

---

## 5. Writing checklist (per string)

1. Lowercase-b "Interior bazzar"? British "enquiry"/"catalogue"?
2. Specific over superlative? (a number/timeline beats an adjective)
3. CTA = action+object, Title Case, no caps, no "!", points to the next step?
4. Empty/error states offer a way forward?
5. Reassurance where trust matters (phone, payment, data)?
6. Reads in the brand's quiet, confident register — not salesy?

> Pair this with [modules-features-flow.md](modules-features-flow.md) (where each string lives in the journey),
> [style.md](style.md) (the component that renders it), and the per-page **COPY** field in
> [pages/README.md](pages/README.md).
