

## Plan: Add Biographical Details to Family Tree Members

### Problem
When clicking on family members (wives, sons, uncles), the side panel shows little or no detail because the `bio` and `bio_en` fields in the `family_members` table are empty or minimal. The user wants rich biographical information sourced from *The Sealed Nectar*.

### What We'll Do

**1. Populate biographical data for all family members**

Update the `family_members` table with detailed Arabic and English bios for:
- **All 11 wives + Maria al-Qibtiyya** (marriage context, age, notable contributions, children)
- **All sons and daughters** (birth, life, death details)
- **Uncles** (Abu Talib, Hamza, Al-Abbas, Abu Lahab, etc.)
- **Birth/death years** where known

All content strictly from *The Sealed Nectar* (Ar-Raheeq Al-Makhtum).

**2. Link companions to family members**

For wives and uncles who also exist in the `companions` table, set the `companion_id` field so the detail panel can offer a "View full profile" link to their companion page.

**3. Enhance the side panel UI**

Update `FamilyTreePage.tsx` to:
- Show a richer detail panel with sections (marriage info, notable events, children list)
- Add a "View Companion Profile" button when `companion_id` is set, linking to `/companions/:id`
- Display birth/death years more prominently
- Add a subtle scroll indicator for long bios

### Technical Details

- **Data updates**: ~30+ `UPDATE` statements via the insert tool to populate `bio`, `bio_en`, `birth_year`, `death_year`, and `companion_id` fields
- **UI changes**: Only `src/pages/FamilyTreePage.tsx` — enhance the `selected` side panel section
- No schema changes needed; all required columns already exist

