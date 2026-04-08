

# Add Foster Brothers Section to Family Tree

## Context
From *The Sealed Nectar*, Prophet Muhammad ﷺ had foster (milk) siblings through his wet nurse **Halimah bint Abi Dhu'ayb al-Sa'diyah**. These include:
- **Abdullah bin Al-Harith** (foster brother)
- **Anisah bint Al-Harith** (foster sister)  
- **Hudhafah / Ash-Shayma' bint Al-Harith** (foster sister, known as Ash-Shayma')

## Plan

### 1. Add new relation type: `foster_sibling`
- Add `foster_sibling` to `relationColors` and `relationLabels` maps in `FamilyTreePage.tsx`
- Color: a distinct teal/cyan shade to differentiate from other relations

### 2. Insert foster siblings into database
- Create a migration to insert 3 family members with `relation_type = 'foster_sibling'`
- Parent will be set to `null` (they aren't children of Abdul-Muttalib)
- Include bilingual names, bios sourced from The Sealed Nectar, and gender fields

### 3. Add "Foster Brothers & Sisters" section in UI
- Add a new section below the uncles/aunts grids in `renderMainTree()`
- Use the same `renderRelativesGrid` pattern with label "إخوة النبي ﷺ من الرضاعة" / "Prophet's Foster Siblings"
- Filter members by `relation_type === 'foster_sibling'`

### Files to modify
- `src/pages/FamilyTreePage.tsx` — add relation type config + render section
- Database migration — insert foster sibling records

