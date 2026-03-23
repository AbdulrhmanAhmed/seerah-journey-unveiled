

## Add Detailed Event Content from The Sealed Nectar

### Current State
- **244 total events** in the database
- **36 events have completely empty** `full_story` and `full_story_en` fields — all from 630–632 CE (late Madinan period: delegations, final year events, death of the Prophet ﷺ)
- **46 events have short stories** (under 500 characters) that need expansion
- Average story length is ~733 characters; best events have ~2,200 characters

### Plan

#### Step 1: Populate the 36 Empty Events
Write detailed bilingual narratives (Arabic + English) for all 36 empty events, sourced from The Sealed Nectar. These include critical events like:
- The Farewell Pilgrimage and Last Sermon
- Death of the Prophet ﷺ and burial
- Year of Delegations (Thaqif, Najran, Banu Tamim, etc.)
- Battle aftermath events (Hunayn spoils, Tabuk consequences)
- Final year events (Prophet's illness, Abu Bakr leading prayers)

Each narrative will be 1,000–2,000 characters with proper scholarly citations.

#### Step 2: Expand Short Events
Enhance the ~46 events with stories under 500 characters, adding more detail from The Sealed Nectar — particularly:
- Death of Abdullah (372 chars)
- Death of Abdul-Muttalib (196 chars)
- Siege of Ta'if (269 chars)
- Expedition of Tabuk (328 chars)

#### Step 3: Add Hadith and Quran References
For events that currently have empty `hadith_references` or `quran_references` JSONB arrays, populate them with relevant citations (e.g., Surah An-Nasr for the revelation event, relevant Bukhari/Muslim hadith numbers).

### Technical Approach
- Use an edge function powered by Lovable AI (Gemini 2.5 Pro) to generate scholarly narratives based on The Sealed Nectar's content for each event
- The function will receive event titles and context, then produce bilingual narratives with proper citations
- Results will be inserted via database UPDATE statements in batches
- All content will follow the existing project standard: bilingual (Arabic/English), citing The Sealed Nectar, Ibn Hisham, and Sahih collections

### Files to Create/Modify
- **New edge function**: `supabase/functions/populate-event-details/index.ts` — AI-powered content generation
- **Database updates**: SQL migrations to batch-update the 36 empty + 46 short events

