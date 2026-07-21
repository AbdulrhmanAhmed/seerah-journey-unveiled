## Goal
Deepen every major battle detail page with substantially more *Sealed Nectar* content. Currently the 12 major battles have short background/aftermath/lessons blurbs but empty `full_story`, no Qur'anic references, no Hadith references, and thin preparations/casualty lists.

## Scope — 12 major battles
Badr al-Kubrā · Uḥud · al-Aḥzāb (Khandaq) · Banū Qurayẓah · al-Ḥudaybiyah · Khaybar · Fatḥ Makkah · Ḥunayn & Awṭās · Siege of aṭ-Ṭāʾif · Muʾtah · Tabūk · Sariyyah Usāmah b. Zayd

## What each battle will gain
For every major battle, expand these existing DB fields using *The Sealed Nectar* (ar-Raheeq al-Makhtum) as the primary source, cross-checked with Ibn Hishām and Ṣaḥīḥ al-Bukhārī/Muslim where Mubarakpuri cites them:

1. **`background` + `background_en`** — expand from ~250 chars to a full multi-paragraph narrative: political context, tribal alliances, immediate trigger.
2. **`preparations` + `preparations_en`** — Prophet's ﷺ consultation (shūrā), troop mobilization, march route, intelligence gathering, spiritual preparation (duʿāʾ, tahajjud).
3. **`full_story` + `full_story_en`** — a long-form chronological narrative (currently empty for all 12). This is the biggest addition: the complete Sealed Nectar chapter condensed into a rich readable account.
4. **`aftermath` + `aftermath_en`** — expand to cover captives, spoils distribution, revealed verses, treaties, political ripple effects.
5. **`lessons` + `lessons_en`** — expand from bullet-style to fuller reflections (leadership, tawakkul, discipline, obedience — mapped to specific incidents in the battle).
6. **`timeline_phases`** — add missing intermediate phases and enrich each phase's `description` / `description_en` with specific figures, dialogue, and named locations.
7. **`key_figures`** — extend to 12-18 named figures per battle (commanders, standard-bearers, martyrs, poets, envoys) with `role`, `note`, and side.
8. **`casualties_detail`** — populate named martyrs and notable enemy casualties from Sealed Nectar's appendices.
9. **`quran_references`** — add the revealed verses tied to each battle (e.g. Sūrat al-Anfāl for Badr, Āl ʿImrān 121-179 for Uḥud, al-Aḥzāb 9-27 for Khandaq, al-Fatḥ for Ḥudaybiyah, al-Tawbah for Tabūk) with `surah`, `surahEn`, `ayah`, `textAr`, `textEn`.
10. **`hadith_references`** — add 2-4 authentic hadiths per battle (Bukhārī/Muslim) with `sourceAr`, `sourceEn`, `textAr`, `textEn`.
11. **`troop_movements`** (where map exists) — add labeled polyline points so `BattleGeoMap` shows march routes.

## Approach
- No schema changes — all fields already exist and the detail page already renders them.
- No new UI components — `BattleDetailPage.tsx` already has sections for every field above (verified: overview, background, forces, tactical, geo, phases, figures, aftermath, lessons, scripture, plus a `full_story` collapsible under phases).
- Content will be written per battle in a series of `supabase--insert` UPDATE calls, one battle per call to keep each migration reviewable.
- Bilingual: Arabic first (primary sources), English mirrored.
- Every added Qurʾān/Hadith reference will use the exact JSONB shape the page already reads (`textAr`/`textEn`/`surah`/`surahEn`/`ayah` for Qurʾān; `sourceAr`/`sourceEn`/`textAr`/`textEn` for Hadith).

## Order of execution
Chronological, one battle per update, so you can review after each:
1. Badr → 2. Uḥud → 3. Khandaq → 4. Banū Qurayẓah → 5. Ḥudaybiyah → 6. Khaybar → 7. Fatḥ Makkah → 8. Ḥunayn/Awṭās → 9. aṭ-Ṭāʾif → 10. Muʾtah → 11. Tabūk → 12. Sariyyah Usāmah.

## Out of scope
- Minor battles / sarāyā (already have generated summaries).
- New pages, routes, or navigation.
- Any UI/styling changes to `BattleDetailPage.tsx`.

## Technical notes
- All writes via `supabase--insert` UPDATE statements against `public.battles` keyed by `slug`.
- JSONB fields will be replaced wholesale (not merged) since current arrays are known.
- Estimated ~12 update calls; each battle's payload is large so they must be sequential, not batched.
