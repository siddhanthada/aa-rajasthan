# AA Rajasthan — project context

Read this before doing any work in this repo. It's the standing brief for scope, IA, and data — don't ask me to re-explain those.

Visual/UI direction is NOT in this file. It's specified fresh in each prompt, in full detail. Don't infer or invent styling — if a prompt doesn't specify something visual, ask rather than guess.

## What this is

A mobile-first directory site so someone in Rajasthan can find a real, current AA meeting quickly, and so local volunteers can keep meeting data accurate without touching code. Loosely inspired by aapune.org, but with a cleaner IA.

Core loop the whole product serves: **find a meeting reliably** + **admin can maintain it easily**. Nothing else matters more than those two things.

## Current phase

**Phase 1 only right now: static screens against mock JSON.** No Firebase, no auth, no real backend. Data lives in `data/mock/*.json` and is read through a thin data-access layer (see below) so swapping to Firestore later touches zero screen code.

Do not scaffold Firebase, Firestore, or auth until explicitly asked to move to Phase 3/4.

## Tech stack

- Next.js (App Router), TypeScript
- Tailwind for utility CSS
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
