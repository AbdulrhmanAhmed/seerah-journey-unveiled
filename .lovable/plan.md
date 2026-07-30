# Fill Out Battle Phases

Today only the 12 major battles have phase timelines (7-10 phases each, title + description only). The other 60 expeditions show an empty phases section.

## What gets built

### 1. Phases for the 60 remaining expeditions
Each sariyyah/expedition gets 4-6 bilingual phases sourced from The Sealed Nectar, following the same narrative arc:
dispatch and objective -> march and route -> contact with the enemy -> engagement -> outcome and return to Madinah.
Written in Arabic and English, with real names, numbers, and places rather than generic filler.

Done in batches of about 10 battles so each batch can be reviewed.

### 2. Richer phases for the 12 major battles
Existing phases keep their titles but gain:
- Longer, more detailed descriptions (specific incidents, named companions, dialogue reported in the sources)
- A `day` label (for example "Saturday, 7 Shawwal 3 AH — dawn")
- A `location` label (for example "Slopes of Mount Uhud")
- 2-4 extra phases where the narrative currently jumps (for example the archers' hill at Uhud, the negotiation rounds at Hudaybiyah)

### 3. Phase stepper UI update
`src/components/battles/PhaseStepper.tsx` renders the new `day` and `location` fields as small labels above each phase title, bilingual and RTL-aware, and stays unchanged in appearance for phases that lack them.

## Technical notes

- Phase objects stay in the existing `timeline_phases` JSONB column on `battles`; no schema migration needed. New optional keys: `day`, `day_en`, `location`, `location_en`.
- Content is written via data updates to `battles`, batched by expedition group.
- The stepper already tolerates both `title`/`phase` key shapes; the new fields are read defensively so older rows keep working.
- Admin editor at `/admin/battles` continues to edit phases as raw JSON — its field hint text is updated to mention the new keys.

## Sources

The Sealed Nectar (ar-Raheeq al-Makhtum), cross-checked against Ibn Hisham and Sahih al-Bukhari/Muslim for named incidents.
