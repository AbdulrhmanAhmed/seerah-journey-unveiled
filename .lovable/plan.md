

## Expand Short Event Narratives

### Problem
The database audit reveals **4 events with English narratives under 500 characters** and many more under 700. The shortest are critical early-life events:

| Event | English | Arabic |
|-------|---------|--------|
| Death of Abdul-Muttalib | 196 chars | 127 chars |
| Death of Abdullah | 372 chars | 127 chars |
| Guardianship of Abu Talib | 427 chars | 253 chars |
| Guardianship of Abdul-Muttalib | 437 chars | 232 chars |

Additionally, ~25 more events have narratives between 500-700 characters that could benefit from expansion.

### Plan

1. **Call the existing `populate-event-details` edge function** for each short event — the function already uses AI to generate scholarly narratives (1000-2000 chars) sourced from *The Sealed Nectar* and *Ibn Hisham's Seerah*, with Hadith and Quran references.

2. **Process in batches**: Run a script targeting the 4 critically short events first (under 500 chars English), then the ~25 events under 700 chars.

3. **Verify results**: Query the database after each batch to confirm narratives were expanded to the target length.

### Technical Details
- Uses the already-deployed `populate-event-details` edge function
- No code changes needed — this is a data enrichment task using existing infrastructure
- The edge function overwrites `full_story`, `full_story_en`, `hadith_references`, and `quran_references` fields

