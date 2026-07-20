
# Battles Deep-Dive — Rich Content + Interactive Visuals

Upgrade `/battles/:slug` from a plain facts page into a museum-grade, interactive battle experience. Each major battle gets full *Sealed Nectar* content and a set of visual modules; minor Sarāyā keep the lighter layout.

## 1. Content enrichment (Sealed Nectar)

Rewrite `full_story`, `key_events`, `quran_references`, `hadith_references` for the 12 major engagements with the full chapter narrative from Al-Mubarakpuri:

Badr, Uḥud, Banū Qaynuqā', Banū Naḍīr, Khandaq (Aḥzāb), Banū Qurayẓah, Banū al-Muṣṭaliq, Ḥudaybiyah, Khaybar, Mu'tah, Fatḥ Makkah, Ḥunayn, Ṭā'if, Tabūk.

Each gets these new JSONB fields:
- `background` / `_en` — political & tribal context (2–4 paragraphs)
- `preparations` / `_en` — mobilization, march, intelligence
- `timeline_phases` — `[{ phase, phase_en, day, description, description_en }]` (pre-battle → engagement → aftermath)
- `key_figures` — `[{ name, name_en, side, role, role_en, note, note_en }]`
- `aftermath` / `_en` — treaties, revelations, strategic impact
- `lessons` / `_en` — bulleted takeaways from the book
- `casualties_detail` — `[{ name, name_en, side, note, note_en }]` for named martyrs & notable slain enemies

## 2. Schema additions

New migration adds nullable columns on `battles`:

```
background, background_en           text
preparations, preparations_en       text
aftermath, aftermath_en             text
lessons, lessons_en                 text
timeline_phases                     jsonb
key_figures                         jsonb
casualties_detail                   jsonb
tactical_map                        jsonb   -- see §4
troop_movements                     jsonb   -- polyline arrows for Leaflet
force_composition                   jsonb   -- {cavalry, infantry, armor…} per side
```

## 3. Redesigned detail page

Structure (each section only renders if data exists):

1. **Cinematic hero** — parallax image, name in Amiri (large), outcome ribbon, Hijri+CE date, location, gradient overlay matching outcome color.
2. **Sticky sub-nav** — Overview · Background · Forces · Tactical Map · Timeline · Key Figures · Aftermath · Lessons · Scripture. Scroll-spy highlights active section.
3. **Force comparison bar** — animated horizontal bars (Muslim vs Enemy) for troops, cavalry, armor, casualties, captives. Framer Motion count-up.
4. **Commander cards** — two facing cards (Muslim / Enemy), portrait icon, name, tribe/role, forces led.
5. **Interactive tactical SVG map** — see §4.
6. **Geographic Leaflet map** — real-world location with marker + troop-movement arrows (from `troop_movements` polylines: Muslim path emerald, Enemy path amber). Reuses the `z-[1200]` rule.
7. **Phase-by-phase timeline** — vertical stepper driven by `timeline_phases`, click a phase to reveal its description; auto-play button steps through phases 1s each.
8. **Key figures grid** — filterable chips (All / Muslim / Enemy / Martyrs), each card opens a side sheet with detail.
9. **Named casualties list** — martyrs section styled with green crescent, notable enemy slain in amber.
10. **Aftermath & Lessons** — two-column card layout.
11. **Scripture** — enhanced Qur'an cards with surah name, ayah range, Arabic (Amiri) + translation, revelation context; Hadith cards with grading.
12. **Related events chips** — links to `/event/:slug` from `related_event_ids`.
13. **"Next battle / Previous battle"** footer nav sorted by hijri_year.

## 4. Tactical map module (per-battle SVG)

Generalize `BadrTacticalMap` into a reusable `TacticalBattleMap` that reads `tactical_map` JSONB:

```jsonc
{
  "terrain": "desert" | "valley" | "mountains" | "urban" | "coast",
  "labels": [{ x, y, text, text_en, color }],
  "features": [{ type: "line"|"ellipse"|"path", ...svgProps }],
  "points": [{
    id, x, y,
    label, label_en,
    side: "muslim"|"enemy"|"neutral",
    description, description_en,
    icon: "camp"|"archer"|"cavalry"|"wells"|"command"|"trench"
  }],
  "arrows": [{ from:[x,y], to:[x,y], side, label?, label_en? }]
}
```

Render:
- Terrain-tinted gradient background per `terrain` type.
- Animated pulse rings on interactive points.
- Directional troop-movement arrows with SVG `<marker>` arrowheads, dashed animation.
- Click a point → floating card (glass panel) with description; keyboard arrows cycle through points.
- Legend (Muslim / Enemy / Strategic feature).
- Optional playhead scrubber that reveals arrows sequentially when `timeline_phases` reference point IDs.

Seed tactical maps for Badr (port existing `badrBattleData`), Uḥud (Mount Uḥud + archers' hill + Khalid's flank), Khandaq (trench line + confederate camps), Ḥunayn (Wadi Ḥunayn ambush), Mu'tah, Khaybar (fortresses of Nāʿim, Qamūṣ etc.), Fatḥ Makkah (four entry columns).

## 5. Admin CRUD updates

Extend `/admin/battles` editor with new tabs:
- **Context**: background, preparations, aftermath, lessons (rich text, ar+en).
- **Phases**: repeatable JSON editor for `timeline_phases`.
- **Figures**: repeatable editor for `key_figures` and `casualties_detail`.
- **Tactical Map**: JSON editor + live SVG preview using the same `TacticalBattleMap` renderer.
- **Movements**: repeat editor for `troop_movements` polylines + inline `LeafletMapPicker` to click waypoints.

## 6. i18n

Add keys: `battleBackground`, `battlePreparations`, `battleAftermath`, `battleLessons`, `battleTacticalMap`, `battleGeoMap`, `battlePhases`, `battleKeyFigures`, `battleMartyrs`, `battleForceComparison`, `battleCavalry`, `battleInfantry`, `battleArmor`, `battleNext`, `battlePrev`, plus phase / side labels — in `ar` and `en`.

## 7. Execution order

1. Migration: add columns.
2. Build `TacticalBattleMap` component + JSON schema helpers.
3. Rebuild `BattleDetailPage.tsx` with sticky sub-nav, force bars, commander cards, phases stepper, geo map, related events, prev/next.
4. Seed enriched content for the 12 major battles (3 SQL batches) with full Sealed Nectar narratives, phases, figures, tactical maps, movements.
5. Extend `AdminBattlesPage` editor with the new tabs.
6. Add translation keys.
7. Playwright verify: `/battles/badr-al-kubra` renders every module, tactical map interactive, geo map draws arrows, sub-nav scroll-spy works, admin round-trip saves JSON.

## Technical details

- Reuse existing `motion/framer-motion`, `Leaflet` via refs (per project rule), `Amiri`/`Tajawal`/`Inter` fonts, semantic tokens only (no hardcoded colors).
- Outcome ribbon uses `outcomeStyles` tokens already in place; add matching gradient token in `index.css`.
- Sticky sub-nav uses `IntersectionObserver` for scroll-spy; hidden on mobile behind a `Sheet`.
- All new JSONB fields nullable so existing Sarāyā rows still render the lean layout.

## Out of scope

- Audio narration per battle (deferred).
- 3D terrain / Mapbox globe (deferred; sticking with Leaflet).
- Video reenactments.
