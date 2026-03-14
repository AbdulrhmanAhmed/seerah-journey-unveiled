

## Custom Voiceover for Interactive Journey

Add an `audio_url` column to `timeline_events`, let admins upload audio files per event, and build a controllable audio player in the Interactive Journey that auto-plays narration as the timeline progresses.

---

### 1. Database Migration

Add `audio_url` column to `timeline_events`:

```sql
ALTER TABLE public.timeline_events ADD COLUMN audio_url text DEFAULT NULL;
```

### 2. Admin Timeline Page — Audio Upload

In `src/pages/AdminTimelinePage.tsx`:
- Add a file input field for audio (MP3/WAV) in the event edit form
- Upload to the existing `seerah-media` storage bucket under `audio/events/{event_id}.mp3`
- Save the public URL to the `audio_url` column
- Show a small play preview button when audio is already uploaded

### 3. Interactive Journey — Audio Player

In `src/pages/InteractiveJourneyPage.tsx`:
- Add `audio_url` to the `TimelineEvent` interface and fetch query
- Create an `audioRef` (`useRef<HTMLAudioElement>`) for playback
- Add a floating audio control bar in the time-bar area with:
  - **Play/Pause** button for current event narration
  - **Volume slider** (small, inline)
  - **Mute toggle**
  - **Auto-narrate toggle** — when ON, automatically plays the audio of the first major event when the year changes
- During autoplay mode with auto-narrate ON: when `currentYear` changes, find the first event with an `audio_url` and play it; wait for audio to finish before advancing to the next year (pause the interval, resume on `ended` event)
- Show a small speaker icon on event markers that have audio

### 4. Events Sidebar — Per-Event Play Button

In `src/components/journey/EventsSidebar.tsx`:
- Add an optional `onPlayAudio` callback prop
- Show a small speaker/play icon button on event cards that have `audio_url`
- Clicking it triggers playback via the parent's audio element

### Files to Modify
- **Migration**: Add `audio_url` to `timeline_events`
- `src/pages/AdminTimelinePage.tsx` — audio upload field
- `src/pages/InteractiveJourneyPage.tsx` — audio player controls + auto-narrate logic
- `src/components/journey/EventsSidebar.tsx` — per-event play button

