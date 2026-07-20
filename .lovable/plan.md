
# Battles Section — Full Plan

Add a dedicated Battles feature with all ~75 military engagements (Ghazawāt + Sarāyā) from *The Sealed Nectar*, backed by a new database table, an admin CRUD panel, and a public browsing experience linked from the homepage.

## 1. Database — new `battles` table

Separate from `timeline_events` because battles carry structured military data that doesn't fit a generic event row.

**Columns**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | e.g. `badr`, `uhud`, `mutah` |
| `name` / `name_en` | text | "غزوة بدر الكبرى" / "Battle of Badr" |
| `kind` | text | `ghazwah` (Prophet led) or `sariyyah` (dispatched) |
| `sequence_number` | int | 1–28 for ghazawāt, 1–~50 for sarāyā |
| `hijri_year` | int | e.g. 2 |
| `hijri_month` | text | "Ramadan" |
| `gregorian_date` | text | "13 March 624 CE" |
| `location_name` / `_en` | text | "بدر" / "Badr wells" |
| `lat`, `lng` | double | for map pin |
| `commander_muslim` / `_en` | text | Prophet ﷺ or the dispatched leader |
| `commander_enemy` / `_en` | text | e.g. Abū Jahl |
| `opponents` / `_en` | text | Quraysh, Banū Naḍīr, etc. |
| `muslim_forces` | int | 313, 1000, 10000 … nullable |
| `enemy_forces` | int | nullable |
| `muslim_casualties` | int | nullable |
| `enemy_casualties` | int | nullable |
| `enemy_captured` | int | nullable |
| `outcome` | text | `victory`, `defeat`, `truce`, `inconclusive`, `withdrawal` |
| `cause` / `_en` | text | short trigger (1–2 sentences) |
| `summary` / `_en` | text | one-paragraph overview |
| `full_story` / `_en` | text | long narrative (markdown) |
| `key_events` | jsonb | array of `{title, title_en, description, description_en}` |
| `quran_references` | jsonb | same shape as `timeline_events.quran_references` |
| `hadith_references` | jsonb | same shape |
| `related_event_ids` | jsonb | link back to `timeline_events` |
| `image_url` | text | hero image |
| `is_major` | boolean | flag the ~10 famous ones (Badr, Uḥud, Khandaq, Qurayẓah, Muṣṭaliq, Ḥudaybiyah, Khaybar, Mu'tah, Fatḥ, Ḥunayn, Ṭā'if, Tabūk) |
| `is_active`, `display_order`, `created_at` | | standard |

**RLS**
- Public `SELECT` where `is_active = true`.
- `INSERT/UPDATE/DELETE` restricted to `has_role(auth.uid(), 'admin')`.
- Matching `GRANT`s for `anon`, `authenticated`, `service_role`.

**Seeding**
- Insert all 28 Ghazawāt with cause/summary/full_story/commanders/forces/casualties/outcome and Qur'anic refs where applicable (Badr → Āl 'Imrān 3:123, Anfāl 8; Uḥud → Āl 'Imrān 3:139-179; Khandaq → Al-Aḥzāb 33:9-27; Banū Naḍīr → Al-Ḥashr; Ḥudaybiyah/Fatḥ → Al-Fatḥ 48; Ḥunayn → At-Tawbah 9:25-27; Tabūk → At-Tawbah 9:38-129).
- Insert all ~50 Sarāyā with commander, year, brief summary, outcome. Long narratives only for the notable ones (Nakhlah, Rajī', Bi'r Ma'ūnah, Ka'b b. al-Ashraf, Mu'tah, Dhāt al-Salāsil, destruction of the three idols, 'Alī to Yemen).
- Every entry cites *The Sealed Nectar* by chapter, matching the existing content standard.

## 2. Public pages

**`/battles` — index**
- Hero: "الغزوات والسرايا / Battles & Expeditions".
- Toggle pills: **All / Major only / Ghazawāt / Sarāyā** + search box + year filter (1–11 AH).
- Grid of cards sorted chronologically:
  - Image or category icon fallback
  - Name (ar/en), Hijri year + Gregorian, location, outcome badge (color-coded: victory=emerald, defeat=amber, truce=blue, inconclusive=slate)
  - Commander line
  - "View details →"
- Skeleton loading + `<QueryErrorState>` (reusing the pattern from the audit).

**`/battles/:slug` — detail**
- Sticky header with name + outcome badge.
- Quick-facts strip: Date (Hijri + CE), Location, Commander (Muslim), Commander (Enemy), Forces (M vs E), Casualties (M vs E).
- Sections (only render if data exists):
  1. Cause / السبب
  2. Summary / ملخص
  3. Full narrative / السرد الكامل
  4. Key events timeline (from `key_events` JSONB, vertical stepper)
  5. Location map — single Leaflet marker at `lat/lng` (reuse existing pattern; `z-[1200]` rule respected)
  6. Qur'anic verses revealed
  7. Hadith references
  8. Related timeline events (chips linking to `/event/:slug`)
- Bilingual (Amiri headings, Tajawal/Inter body); full RTL/LTR mirroring via `useLanguage`.

## 3. Homepage integration

- Add a new pillar card in `PillarsSection.tsx` — "Battles & Expeditions / الغزوات والسرايا" → `/battles`, using a `Swords` Lucide icon and the existing emerald/gold token palette.
- Add link in `Footer.tsx` under an "Explore" list.
- **No Navbar entry** (per your rule against adding Library/Map/Event Graph — Battles will follow the same policy).

## 4. Admin CRUD — `/admin/battles`

Mirror the existing `/admin/timeline` pattern:
- List table (sortable by `hijri_year`, filterable by `kind` and `outcome`).
- "Add battle" and "Edit" dialogs with tabs: **Basic**, **Forces & Outcome**, **Narrative**, **Key events**, **Scripture refs**, **Media**.
- Rich-text (existing editor) for `full_story` and `full_story_en`.
- JSONB editors for `key_events`, `quran_references`, `hadith_references` (same UX as timeline admin).
- Media picker binds to the existing `seerah-media` bucket.
- Sidebar link in `AdminLayout` (icon: `Swords`).

## 5. i18n

- Add new keys to `src/i18n/translations.ts` in both `ar` and `en`: `battlesTitle`, `battlesSubtitle`, `filterGhazawat`, `filterSaraya`, `filterMajor`, `outcomeVictory/Defeat/Truce/Inconclusive/Withdrawal`, `commanderMuslim`, `commanderEnemy`, `muslimForces`, `enemyForces`, `casualties`, `captives`, `cause`, `keyEvents`, `viewFullBattle`, etc.

## 6. Technical execution order

1. Migration: create `battles` table + GRANTs + RLS + policies. Await approval.
2. Seed script (via `supabase--insert`) — three batches:
   - Batch A: 12 major ghazawāt with full narratives.
   - Batch B: remaining 16 ghazawāt with short summaries.
   - Batch C: ~50 sarāyā with commander/year/summary.
3. Types regenerate → build public `/battles` list page + `useBattles` query hook.
4. Build `/battles/:slug` detail page.
5. Wire homepage `PillarsSection` card + footer link.
6. Build `/admin/battles` list + editor dialog; add sidebar entry.
7. Add all translation keys.
8. Verify with Playwright: `/battles` renders, filter works, detail page loads, admin CRUD create/edit round-trips.

## Out of scope (unless you add them later)

- Interactive tactical maps (like the existing Badr SVG). We can migrate `BattleOfBadrPage` into this system in a second pass and add SVG tactical maps as a JSONB field per battle.
- Audio narration per battle.
- Bookmarks / share buttons.
