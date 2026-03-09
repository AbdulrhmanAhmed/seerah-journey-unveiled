

# Populate Remaining Minor Events with Scholarly Content

## Scope

There are **26 unpopulated events** (no `full_story`, no slugs, no references) spanning from 570 CE to 610 CE. Additionally, there are duplicate entries to clean up (e.g., two "Marriage to Khadijah" records).

## Events to Populate (grouped)

### Pre-Prophethood (570–609 CE)
1. **Year of the Elephant** (570) — Abraha's army, Surah Al-Fil context
2. **Return to mother Aminah** (575)
3. **First journey to Syria** (582) — trade caravan with Abu Talib
4. **The Fijar War** (585) — tribal conflict, young Muhammad's ﷺ role
5. **Working as a shepherd** (588) — hadith: "Every prophet herded sheep"
6. **Pact of al-Fudul** (590) — justice alliance, his praise of it later
7. **Working in trade** (590) — reputation as Al-Amin
8. **Trade journey to Syria for Khadijah** (595) — Maysarah's testimony
9. **Marriage to Khadijah** (595) — merge duplicate into one record with full content
10. **Birth of Al-Qasim** (598)
11. **Birth of Zaynab** (599)
12. **Birth of Ruqayyah** (601)
13. **Birth of Umm Kulthum** (603)
14. **Birth of Fatimah al-Zahra** (605)
15. **Rebuilding of the Kaaba** (605) — Black Stone arbitration
16. **Worship in Cave Hira** (608) — tahannuth, spiritual preparation

### Early Revelation (610 CE)
17. **Revelation begins — Iqra** (duplicate of existing "First Revelation" — merge or remove)
18. **Conversion of Khadijah**
19. **Conversion of Ali ibn Abi Talib**
20. **Conversion of Zayd ibn Harithah**
21. **Conversion of Abu Bakr al-Siddiq**
22. **Pause in Revelation (Fatrah)**
23. **Revelation of Surah Al-Muddaththir**
24. **The Secret Call to Islam**

## Data per Event

Each event will receive:
- `slug` — URL-friendly identifier
- `full_story` / `full_story_en` — 200-400 word scholarly narrative (Arabic + English) sourced from The Sealed Nectar (Ar-Raheeq Al-Makhtum)
- `quran_references` — JSONB array of relevant Surah/Ayah citations (e.g., Surah Al-Fil for Year of the Elephant)
- `hadith_references` — JSONB array with source, narrator, and text (e.g., Sahih Bukhari for shepherd hadith)

## Cleanup

- **Remove duplicate** "Marriage to Khadijah" (id: `39bcb423`) — keep the one with slug `khadijah` (id: `04996afa`)
- **Remove duplicate** "Year of the Elephant" (id: `89f8f9ad`) — keep "Birth of Prophet Muhammad ﷺ" which already has content
- **Remove duplicate** "Revelation begins - Iqra" (id: `40529eb6`) — already covered by the populated "First Revelation" event

## Implementation

All changes are **data updates** (not schema), so will use the insert/update tool:
1. Delete 3 duplicate records
2. Batch UPDATE each remaining event with `slug`, `full_story`, `full_story_en`, `quran_references`, `hadith_references`
3. Updates will be done in batches of 4-5 events per tool call for efficiency

## Content Sources

- **The Sealed Nectar** (Ar-Raheeq Al-Makhtum) by Safi-ur-Rahman al-Mubarakpuri
- **Sahih al-Bukhari** and **Sahih Muslim** for hadith citations
- **Ibn Hisham's Sirah** for supplementary narrative detail

