

# Plan: Fix Geographic Coordinates for 227 Timeline Events

## Problem
227 out of 244 timeline events share the same default coordinates (21.4225, 39.8262 — central Makkah). On the Interactive Journey map, all these events stack on one point, making the map nearly useless.

Only 17 major events (Badr, Uhud, Hijrah, etc.) currently have correct unique coordinates.

## Coordinate Source

I will assign coordinates based on **known historical geography** — the actual locations where events took place, cross-referenced with *The Sealed Nectar* and standard Seerah sources. The key locations and their coordinates:

| Location | Latitude | Longitude | Events |
|---|---|---|---|
| Makkah / Haram area | 21.4225 | 39.8262 | Kaaba events, public dawah, Safa warning |
| Shi'b Bani Hashim (Makkah) | 21.4265 | 39.8275 | Births, family events, marriages |
| Makkah residential | 21.4240 | 39.8250 | Conversions, secret meetings |
| Dar al-Arqam (near Safa) | 21.4230 | 39.8255 | Gathering at Dar al-Arqam |
| Persecution sites (Makkah) | 21.4210 | 39.8240 | Torture, boycott decree |
| Shi'b Abi Talib | 21.4310 | 39.8320 | Boycott years |
| Cave Hira (Jabal al-Nour) | 21.4573 | 39.8594 | Worship, early revelation |
| Cave Thawr | 21.3767 | 39.8490 | Hijrah preparation |
| Mina (Aqabah) | 21.4133 | 39.8933 | Pledges of Aqabah |
| Damascus, Syria | 33.5138 | 36.2765 | Trade journeys |
| Axum, Ethiopia | 14.1210 | 38.7469 | Abyssinia migrations |
| Jerusalem (Al-Aqsa) | 31.7781 | 35.2354 | Isra & Mi'raj |
| Ta'if | 21.2703 | 40.4159 | Ta'if journey, siege |
| Quba (Madinah outskirts) | 24.4398 | 39.6168 | Quba arrival, mosque |
| Madinah / Masjid al-Nabawi | 24.4672 | 39.6111 | Most Madinah-era events |
| Mount Uhud | 24.5033 | 39.6158 | Uhud battle events |
| Khandaq (north Madinah) | 24.4750 | 39.6100 | Trench battle events |
| Banu Qurayzah (SE Madinah) | 24.4500 | 39.6200 | Siege and judgment |
| Hudaybiyyah | 21.4500 | 39.7500 | Treaty events |
| Khaybar | 25.6989 | 39.2939 | Khaybar conquest |
| Hunayn | 21.3500 | 40.0500 | Hunayn battle |
| Tabuk | 28.3838 | 36.5550 | Tabuk expedition |
| Mu'tah (Jordan) | 31.0500 | 35.7000 | Battle of Mu'tah |
| Al-Abwa | 23.0833 | 39.1333 | Death of Aminah |
| Marr az-Zahran | 21.5500 | 39.8500 | Makkah conquest approach |
| Various early expedition sites | Per event | Per event | Abwa, Buwat, Ushayrah, etc. |

Events within the same city (e.g., Makkah) get **slight coordinate offsets** so they don't stack — the map's existing spiral-offset logic handles nearby markers, but having distinct base coordinates helps.

## Implementation

**Single step**: Write a SQL migration with ~15 batch UPDATE statements, grouping events by location. Each UPDATE targets events by their `slug` and the condition `lat = 21.4225 AND lng = 39.8262` to only touch unfixed events.

The batches:
1. Makkah Haram events (keep at default or minor offset)
2. Births/family events (Shi'b Bani Hashim)
3. Conversion events (Makkah residential)
4. Persecution events
5. Boycott events (Shi'b Abi Talib)
6. Trade/shepherd (Makkah outskirts)
7. Trade to Syria (Damascus)
8. Cave Hira
9. Year of Sorrow deaths
10. Abyssinia migrations (Ethiopia)
11. Isra & Mi'raj (Jerusalem)
12. Aqabah pledges (Mina)
13. Cave Thawr / Hijrah start
14. Quba events
15. All Madinah-era events (Masjid al-Nabawi area)
16. Battle-specific locations (Uhud, Khandaq, Qurayzah, Hudaybiyyah, Khaybar, Hunayn, Tabuk, Mu'tah, early expeditions)
17. Catch-all: remaining Makkah-era defaults get slight offset; remaining Madinah-era defaults get Madinah coords

**No frontend changes needed** — the Interactive Journey page already reads `lat`/`lng` from the database and renders markers accordingly.

## Technical Details

- Tool: database insert tool (supports UPDATE statements)
- All 227 events updated in one operation
- No schema changes required
- Coordinates are historically accurate GPS locations
- Events in the same area get slight lat/lng variations (0.001-0.005 degrees) to prevent exact stacking

