

## Three New Features: Quiz System, Family Tree, and Companions Directory

### Overview
Add three major features to the Seerah app: an interactive quiz system with scoring, a visual family tree, and a searchable Companions directory. Each gets its own page and navigation entry.

---

### 1. Database Schema (3 new tables + 1 update)

**`companions` table** — stores Sahaba profiles
- `id` (uuid, PK), `name` (text), `name_en` (text), `nickname` (text), `nickname_en` (text)
- `bio` (text), `bio_en` (text), `category` (text: muhajir/ansar/family/other)
- `birth_year` (text), `death_year` (text), `image_url` (text)
- `notable_roles` (jsonb), `related_event_ids` (jsonb)
- `family_relation` (text) — relation to the Prophet ﷺ if any
- `is_active` (boolean, default true)
- RLS: public read, admin write

**`family_members` table** — for the family tree visualization
- `id` (uuid, PK), `name` (text), `name_en` (text)
- `relation_type` (text: grandfather/father/mother/wife/son/daughter/uncle/aunt)
- `parent_id` (uuid, nullable, self-ref FK) — tree hierarchy
- `companion_id` (uuid, nullable, FK to companions) — link to companion profile if exists
- `birth_year` (text), `death_year` (text), `bio` (text), `bio_en` (text)
- `image_url` (text), `display_order` (int)
- RLS: public read, admin write

**`quiz_questions` table** — stores questions per era
- `id` (uuid, PK), `era` (text: makkah/madinah)
- `question` (text), `question_en` (text)
- `options` (jsonb — array of 4 choices, each with `text`, `text_en`, `is_correct`)
- `explanation` (text), `explanation_en` (text)
- `difficulty` (text: easy/medium/hard), `related_event_id` (uuid, nullable)
- `display_order` (int), `is_active` (boolean)
- RLS: public read, admin write

**`quiz_scores` table** — tracks user progress (requires auth)
- `id` (uuid, PK), `user_id` (uuid, FK to auth.users, ON DELETE CASCADE)
- `era` (text), `score` (int), `total_questions` (int)
- `completed_at` (timestamptz, default now())
- RLS: users read/insert own scores only

---

### 2. New Pages

**`QuizPage.tsx`** (`/quiz`)
- Era selector (Makkah / Madinah / All)
- Difficulty filter (Easy / Medium / Hard)
- One question at a time with 4 multiple-choice options
- Immediate feedback with explanation after each answer
- Progress bar showing current question number
- Final score screen with percentage and option to retry
- Links to related event detail pages from explanations
- Scores saved to `quiz_scores` if user is logged in (anonymous users can still play without saving)

**`FamilyTreePage.tsx`** (`/family-tree`)
- Hierarchical tree visualization using CSS/SVG (no heavy library)
- Starts from Abdul-Muttalib down through the Prophet ﷺ
- Shows wives, children, and grandchildren as branches
- Clickable nodes open a side panel with bio, dates, and links to companion profile if available
- Responsive: horizontal scroll on mobile, centered tree on desktop
- Color-coded by relation type (wives in one color, children in another, etc.)

**`CompanionsPage.tsx`** (`/companions`)
- Grid of companion cards with name, image placeholder, category badge
- Search bar (filters by name in both AR/EN)
- Category tabs: All / Muhajiroon / Ansar / Ahl al-Bayt
- Clicking a card opens a detail modal/page with full bio, notable roles, and linked timeline events
- Links to `/event/:slug` for related events

---

### 3. Navigation Update

Add three new entries to the Navbar pillars array:
- Quiz (`/quiz`) with `Brain` icon
- Family Tree (`/family-tree`) with `GitBranch` icon  
- Companions (`/companions`) with `Users` icon

Update `translations.ts` with AR/EN labels for all new nav items and UI strings.

---

### 4. Data Population

After tables are created, use the edge function pattern (or direct inserts) to populate:
- ~30-50 quiz questions per era from The Sealed Nectar content
- ~25-30 family members for the tree
- ~30-40 key companions with bios

---

### 5. Routes

Add to `App.tsx`:
```
/quiz → QuizPage
/family-tree → FamilyTreePage
/companions → CompanionsPage
```

All wrapped in `<Layout>` for consistent header/footer.

---

### Implementation Order
1. Create all 4 database tables via migration
2. Build Companions page (simplest, standalone)
3. Build Family Tree page
4. Build Quiz page with scoring
5. Update navigation and translations
6. Populate data

