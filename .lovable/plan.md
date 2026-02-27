

## Admin Panel for Map Management

This is a large feature requiring backend infrastructure. Since you don't have Supabase connected yet, I'll need to enable Lovable Cloud first, then build the database and admin UI.

### Phase 1: Enable Lovable Cloud + Database

**Tables to create:**

```text
paths
├── id (uuid, PK)
├── name (text) — Arabic
├── name_en (text) — English
├── description (text)
├── description_en (text)
├── line_color (text, HSL string)
├── is_active (boolean, default true)
├── created_at (timestamptz)

path_steps
├── id (uuid, PK)
├── path_id (uuid, FK → paths)
├── step_order (integer)
├── label (text) — Arabic
├── label_en (text) — English
├── description (text)
├── description_en (text)
├── coord_x (float)
├── coord_y (float)
├── segment_type (text: "land" | "sea")
├── location_id (text, nullable) — links to map location
├── created_at (timestamptz)

map_locations
├── id (text, PK)
├── name / name_en / name_arabic (text)
├── x, y (float)
├── description / description_en (text)
├── primary_category (text)
├── is_active (boolean, default true)
├── travel_data (jsonb) — camel/car times
├── created_at (timestamptz)

location_events
├── id (uuid, PK)
├── location_id (text, FK → map_locations)
├── label / label_en (text)
├── category (text)
├── event_order (integer)
```

RLS: All tables public-read. Write operations require authenticated admin role (using `user_roles` table pattern).

### Phase 2: Admin Pages

**1. `/admin` — Admin Dashboard**
- Protected route (requires login + admin role)
- Navigation to: Paths Manager, Locations Manager, Categories overview

**2. `/admin/paths` — Path Manager**
- List all paths with active/inactive toggle
- Create/Edit path form: name (AR/EN), description (AR/EN), line color picker, is_active
- For each path: step sequencer with drag-and-drop reordering
- Each step: label (AR/EN), description (AR/EN), coordinates (x, y), segment type dropdown, optional location link
- "Preview on Map" button — renders a mini SVG preview of the path
- Delete path with confirmation

**3. `/admin/locations` — Location Manager**
- List all map locations with edit/delete
- Create/Edit location form: name (AR/EN), coordinates, description, primary category dropdown, travel data fields
- Manage events per location: add/remove/reorder events with category assignment
- Coordinate picker: click on a mini map to set x/y

**4. CSV Bulk Upload** (on paths page)
- Upload CSV with columns: `path_name, step_label, step_label_en, order, x, y, segment_type`
- Preview parsed data before committing
- Creates path + steps in one batch

### Phase 3: Connect Public Map to Database

- Replace static `mapPaths` and `mapLocations` imports with Supabase queries (via TanStack Query)
- Filter by `is_active = true` for public view
- Keep existing map rendering, cinematic mode, and step navigation — just swap data source

### Technical Notes
- Admin auth: simple email/password login with `user_roles` table for admin check
- No changes to map rendering logic — only the data source changes
- All existing features (category filter, cinematic mode, path selector) work unchanged with database data

