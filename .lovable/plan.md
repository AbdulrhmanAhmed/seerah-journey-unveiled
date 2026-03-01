

## Plan: Populate 250 Timeline Events

**Current state:** 17 events in `timeline_events` table. Need 233 more to reach 250.

**Approach:** Insert events in batches using the data insert tool. Events will be historically accurate, covering the full 570–632 AD range with proper bilingual content, coordinates, era, and category assignments.

### Event Distribution (233 new events across categories)

| Period | Years | Approx. New Events |
|--------|-------|-------------------|
| Pre-Prophethood | 570–609 | ~25 (childhood, youth, trade journeys, notable Makkah events) |
| Early Makkah | 610–614 | ~30 (early converts, secret preaching, persecution begins) |
| Mid Makkah | 615–618 | ~30 (Abyssinia migrations, boycott details, notable conversions) |
| Late Makkah | 619–622 | ~30 (Ta'if, Isra/Mi'raj, Aqabah pledges, Hijrah preparations) |
| Early Madinah | 622–624 | ~30 (mosque building, brotherhood pact, early expeditions, Badr) |
| Mid Madinah | 625–628 | ~40 (Uhud, Banu Nadir, Trench, Hudaybiyyah, diplomatic letters) |
| Late Madinah | 629–632 | ~48 (Khaybar, Mu'tah, Conquest, Hunayn, delegations, farewell) |

### Event Categories Used
- `milestone`, `battle`, `contract`, `challenge`, `marriage`, `diplomacy`

### Data per Event
- Bilingual titles and descriptions (Arabic + English)
- `year_ce`, `year_hijri`, `era` (makkah/madinah)
- `map_x`, `map_y` coordinates matching the location
- `category`, `is_major` flag, `timeline_visible: true`
- Sequential `display_order`

### Implementation Steps

1. **Insert events in ~8 batch SQL statements** (30 rows each) using the data insert tool
2. **Update the fallback array** in `InteractiveJourneyPage.tsx` to include a broader sample (~15-20 key events) for resilience
3. **Verify the count** reaches 250 with a query

### Technical Notes
- All RLS policies already in place — public SELECT is enabled
- The existing page code fetches all `timeline_visible = true` events, so no query changes needed
- Map coordinates will cluster around key locations (Makkah, Madinah, Badr, Uhud, Ta'if, Hudaybiyyah, Khaybar, Tabuk)

