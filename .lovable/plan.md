# Fill Out Battle Phases

Phase descriptions today are one-line summaries (e.g. Badr: "The Prophet ﷺ consults; Abu Bakr, Umar and Miqdad speak, then Sa'd b. Mu'adh pledges the Ansar's absolute obedience"). They need to read like a proper narrative section of The Sealed Nectar.

## What gets built

### 1. Deep rewrite of phases for the 12 major battles

Every phase description is expanded from one line to a full 120-250 word bilingual passage containing:
- Named participants and their exact reported words (e.g. al-Miqdad: "We will not say as the people of Musa said, 'Go you and your Lord and fight'..."; Sa'd b. Mu'adh's pledge to cross the sea with him)
- Numbers, dates, and distances as given in the sources (troop counts, camels, horses, day and month, march stages)
- The place and terrain where the phase happened
- The immediate consequence that leads into the next phase

Plus per-phase metadata rendered above the title:
- `day` / `day_en` — e.g. "Friday, 17 Ramadan 2 AH — dawn"
- `location` / `location_en` — e.g. "The wells of Badr, northern slope"

Extra phases are inserted where the narrative currently jumps (Uhud's archers' hill, Hudaybiyah's rounds of negotiation, Khaybar's forts taken one by one).

Order of work: Badr, Uhud, al-Ahzab, Banu Qurayzah, Hudaybiyah, Khaybar, Fath Makkah, Hunayn, at-Ta'if, Mu'tah, Tabuk, Usamah — in batches of 2-3 battles so each batch can be reviewed.

### 2. Phases for the 60 expeditions that have none

Each gets 4-6 phases at the same level of detail the sources allow: dispatch and objective, march and route, contact, engagement, outcome and return.

### 3. Phase stepper UI

`src/components/battles/PhaseStepper.tsx` gains:
- Small bilingual day/location labels above each phase title
- Comfortable reading typography for long passages (paragraph spacing, max reading width, RTL-aware)
- Graceful rendering for phases that lack the new fields

## Technical notes

- No schema migration: phases stay in the `timeline_phases` JSONB column on `battles`, with new optional keys `day`, `day_en`, `location`, `location_en`.
- Content is applied as batched data updates.
- The stepper already tolerates both `title`/`phase` key shapes; new fields are read defensively.
- The admin JSON field hint at `/admin/battles` is updated to list the new keys.

## Sources

The Sealed Nectar (ar-Raheeq al-Makhtum), cross-checked with Ibn Hisham and Sahih al-Bukhari/Muslim for quoted speech and named incidents.
