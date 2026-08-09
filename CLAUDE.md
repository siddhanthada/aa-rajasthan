# AA Rajasthan — project context

Read this before doing any work in this repo. It's the standing brief — don't ask me to re-explain scope, design direction, or data shape; it's all here.

## What this is

A mobile-first directory site so someone in Rajasthan can find a real, current AA meeting quickly, and so local volunteers can keep meeting data accurate without touching code. Loosely inspired by aapune.org, but with a cleaner IA and a civic/public-service visual language instead of a startup one.

Core loop the whole product serves: **find a meeting reliably** + **admin can maintain it easily**. Nothing else matters more than those two things.

## Current phase

**Phase 1 only right now: static screens against mock JSON.** No Firebase, no auth, no real backend. Data lives in `data/mock/*.json` and is read through a thin data-access layer (see below) so swapping to Firestore later touches zero screen code.

Do not scaffold Firebase, Firestore, or auth until explicitly asked to move to Phase 3/4.

## Tech stack

- Next.js (App Router), TypeScript
- Tailwind for utility CSS — but overridden per the design system below, not Tailwind's default soft-UI look
- Firestore later (Phase 3+), not now

## Information architecture

```
Home (= Find a Meeting, merged — no separate landing page)
├── Find a Meeting
│   ├── District/city browse (primary filter — not free-text/PIN search)
│   ├── Today / this week toggle
│   ├── Language + format filters
│   ├── List / Map toggle (map loads on demand, not by default)
│   └── Meeting detail (address, directions, first-timer reassurance, "report an issue" link)
├── New to AA (what is AA, what happens at a meeting, common questions, self-check — no diagnostic scoring)
├── Concerned about someone (single merged page, not split by audience)
├── About AA (Rajasthan/India history, how AA works)
└── Helpline — persistent, same visual weight as "Find a meeting," not a nav item

/admin (separate protected route, not in public nav — build the UI now, auth comes in Phase 4)
├── Meetings (list, add/edit, mark cancelled/exception, mark verified)
├── Groups
├── Venues
└── Corrections (public "report an issue" submissions)
```

## Design system

**Principle:** this should read as a trustworthy public-service resource, not a startup product. Think GOV.UK-level restraint — plain, text-first, earns trust through clarity rather than polish — with exactly one deliberate regional flourish (see "The one flourish" below). Not sterile, not decorated.

**Never do these, no matter how tempting Tailwind defaults make them:**
- No gradients, anywhere
- No drop shadows / `shadow-lg` card elevation — use hairline borders instead
- No glassmorphism / backdrop-blur
- No floating 3D icons or icon illustrations
- No stock photography or illustrated people — this is a sensitive-context site
- No scroll-triggered fade/slide-in animations
- No big `rounded-2xl` soft cards
- No default Inter/Poppins/Manrope — use the type system below
- No purple-to-blue SaaS gradient color schemes

**Typography:** IBM Plex Sans for everything, Latin and Devanagari both — it's one family with native support for both scripts, so Hindi headings/body never look like a bolted-on second font. Load `IBM Plex Sans` and `IBM Plex Sans Devanagari`.

**Color palette (hex):**
| Token | Hex | Use |
|---|---|---|
| `paper` | `#F7F4EE` | page background — warm, not clinical white |
| `ink` | `#22201C` | primary text |
| `ink-muted` | `#6B675E` | secondary/meta text |
| `indigo` | `#2B3A55` | primary accent — links, primary actions, top-border emphasis |
| `terracotta` | `#B5502E` | secondary accent — tags, alerts, "open meeting" type labels |
| `sandstone` | `#8A6D3B` | tertiary, used sparingly — small metadata like "verified" dates |
| `border` | `#D8D2C4` | hairline borders, 0.5–1px |

**Corners:** sharp to near-sharp, 0–2px radius. Never `rounded-xl`/`rounded-2xl`.

**Elevation:** none via shadow. Use a hairline border by default; for emphasis on a card (e.g. a featured/today's meeting), use a 2px solid top border in `indigo` instead of a shadow.

**Density:** text-forward, real information density — meeting cards should read like a transit/timetable listing, not a marketing feature card. Avoid large empty marketing-style whitespace blocks.

**Motion:** none or near-none. No animation library. A simple opacity/color transition on hover/focus is fine; nothing else.

**The one flourish:** a jali-lattice-inspired geometric pattern (Rajasthani architectural motif, abstracted — not photographic, not colorful) used as a very low-opacity (4–8%) monochrome background texture. Use it in at most one place per screen — the hero background on the homepage, or an empty-state illustration substitute. Never as a border decoration, never repeated multiple times on one screen, never in an accent color (ink or indigo only, at low opacity).

Starter tileable pattern to refine visually once it's in the browser — an octagon-and-star lattice, the most common jali geometry:

```html
<svg width="0" height="0" style="position:absolute">
  <defs>
    <pattern id="jali" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M24 0 L48 24 L24 48 L0 24 Z M24 10 L38 24 L24 38 L10 24 Z"
            fill="none" stroke="#22201C" stroke-width="1"/>
    </pattern>
  </defs>
</svg>
<!-- apply as: background-image: url(#jali) at opacity 0.05–0.08, or as an SVG rect fill="url(#jali)" -->
```

Treat this as a rough starting geometry, not a final asset — adjust scale/opacity once you can actually see it against the paper background.

## Data model

Shaped to match Firestore documents so the future swap is a source change, not a redesign.

```ts
type District = {
  id: string
  name: string
  displayOrder: number
}

type Venue = {
  id: string
  name: string
  address: string
  locality: string
  districtId: string
  mapLink?: string
}

type Group = {
  id: string
  name: string
  districtId: string
  contactChannel?: string // fellowship/helpline-style contact — never an individual's personal number
}

type Meeting = {
  id: string
  groupId: string
  venueId: string // omit / mark "online" for online-only meetings
  daysOfWeek: number[]
  startTime: string
  endTime?: string
  languages: ("hi" | "en")[]
  format: "in_person" | "online" | "hybrid"
  access: "open" | "closed"
  verificationStatus: "unverified" | "verified" | "needs_review"
  lastVerifiedAt?: string
  published: boolean
}

type MeetingException = {
  id: string
  meetingId: string
  date: string
  type: "cancelled" | "venue_changed" | "time_changed"
  note?: string
}

type CorrectionRequest = {
  id: string
  meetingId: string
  reason: "meeting_didnt_happen" | "time_wrong" | "venue_changed" | "map_wrong" | "other"
  note?: string
  status: "open" | "reviewed" | "dismissed"
  submittedAt: string
}
```

## Data-access layer (build this first)

```
lib/data/
  types.ts     — the interfaces above
  meetings.ts  — getMeetings(filters), getMeetingById(id), etc.
  groups.ts
  venues.ts

data/mock/
  meetings.json
  groups.json
  venues.json
```

Every screen calls functions from `lib/data/*`, never reads the JSON files directly. That's the whole point — when Phase 3 swaps these functions to hit Firestore, no screen code changes.

## What NOT to build in V1

- No member accounts, profiles, login for visitors, or attendance tracking
- No geolocation "near me" search — district/city selection only, data won't be dense enough for proximity search to feel useful yet
- No multi-role admin (single admin role for now)
- No admin CMS for static page content — hardcode About/New to AA copy directly in the codebase
- No PIN/free-text location search
- The "More" nav pattern, a 4-way "Help Someone" audience split — collapse into one "Concerned about someone" page

## Anonymity & privacy rules (non-negotiable)

- No public individual names or personal phone numbers — group-level/helpline contact channels only
- No storing visitor geolocation
- No accounts required to search
- Neutral page titles, nothing loud in browser history
- Admin-only fields (internal notes, any future individual contact info) must live in separate documents/collections from public-readable data — never as extra fields on a publicly-readable document
