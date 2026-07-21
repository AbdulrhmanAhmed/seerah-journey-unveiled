## Goal

1. Make the Battles feature reachable directly from the main navbar (currently only linked from the homepage and footer).
2. Fill in the missing rich Sealed Nectar content for every battle that is still a stub, so opening any card in `/battles` leads to a meaningful detail page — not an almost-empty screen.

## Current state (verified)

- Navbar (`src/components/Navbar.tsx`) has no Battles entry.
- 65 of the ~75 battles have no `background`, `preparations`, `aftermath`, `lessons`, `timeline_phases`, `key_figures`, or `tactical_map`. Only 9 major battles are fully populated (Badr, Uḥud, Khandaq, Ḥudaybiyah, Khaybar, Ḥunayn, Muʾtah, Fatḥ Makkah, Tabūk).
- Still-empty majors: **Banū Qurayẓah**, **Siege of aṭ-Ṭāʾif**, **Usāmah b. Zayd to Ubnā**.

## 1. Navbar entry

Edit `src/components/Navbar.tsx`:
- Import `Swords` from lucide-react.
- Add `{ name: t("navBattles"), icon: Swords, path: "/battles" }` to the `pillars` array, placed right after Interactive Journey so battle content sits near the timeline pillars.
- No new translation key needed (`navBattles` already exists in `src/i18n/translations.ts`).

The mobile menu picks up the same array automatically.

## 2. Battle content expansion (Sealed Nectar sourced)

Two migrations updating existing rows in the `battles` table — no schema change, no new tables.

### 2a. Remaining major battles — full rich payload

For each of `bani-qurayzah`, `at-taif`, `sariyyah-usamah`, set the same fields already used for Badr/Uḥud/etc.:
- `background`, `background_en`
- `preparations`, `preparations_en`
- `aftermath`, `aftermath_en`
- `lessons`, `lessons_en`
- `timeline_phases` (JSONB: 6-9 phases with `title`/`title_en`, `description`/`description_en`, optional `hijri_date`)
- `key_figures` (JSONB: 6-9 figures with `name`/`name_en`, `role`/`role_en`, `side`)
- `casualties_detail` (JSONB with `muslim`, `enemy`, `captives`, etc.)
- `tactical_map` (JSONB — reuse the same schema `TacticalBattleMap` already renders: `points[]` with x/y/label, `arrows[]` with from/to/side)

### 2b. All remaining minor battles/expeditions — concise payload

For every battle where `background IS NULL`, populate at minimum:
- `background` / `background_en` — 2-3 paragraphs on context and cause from Sealed Nectar
- `preparations` / `preparations_en` — force size, commander, banner colour, route
- `aftermath` / `aftermath_en` — outcome, spoils, follow-up
- `lessons` / `lessons_en` — 1-2 paragraph reflection
- `key_figures` (JSONB) — 3-5 entries (commander + notable participants)
- `casualties_detail` (JSONB) — even if `{ muslim: 0, enemy: 0, notes }` when Sealed Nectar records no casualties
- `summary` / `summary_en` — improved 1-2 sentence card blurb if currently empty

Small skirmishes (assassination sarāyā like Kaʿb b. al-Ashraf, Abū Rāfiʿ) will not receive a `tactical_map` or multi-phase timeline — those visual modules already render nothing when the JSON is absent, which is intended.

## 3. Detail page verification

`src/pages/BattleDetailPage.tsx` already gates every section on the presence of its data field, so no code changes are needed there. After the seed migrations run, previously empty pages (e.g. `/battles/katl-kab-ibn-al-ashraf`, the page the user is currently on) will render the new Background / Preparations / Aftermath / Lessons / Key Figures / Casualties sections automatically.

## Out of scope

- No schema changes.
- No changes to admin battle editor.
- No new components or route changes.
- Custom images for battles (would need generation; can be a follow-up if desired).

## Technical notes

- Two migrations to keep each under the SQL size limit: (a) three remaining majors with full payload, (b) all minor battles in one batch using `UPDATE ... WHERE slug = '...'` per row.
- All Arabic strings sourced from Ar-Raḥīq al-Makhtūm (Al-Mubarakpuri), cross-checked with Ibn Hishām for figure roles.
- JSONB columns will be inserted as valid JSON literals so existing components (`PhaseStepper`, `ForceComparison`, `TacticalBattleMap`) consume them without modification.
