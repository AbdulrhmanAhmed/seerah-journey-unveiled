

# Fix Category Filter: Select-One Behavior

## Problem
Currently, clicking a category (e.g., "Battle") toggles it on/off within a multi-select set. The user wants **exclusive selection**: clicking "Battle" should show **only** battles on the map.

## Solution
Change `toggleCategory` to replace the entire set with just the clicked category. If the user clicks the already-sole-active category, restore all categories (show everything).

### File: `src/pages/InteractiveJourneyPage.tsx`

**Change `toggleCategory` (~line 695-705):**
```typescript
const toggleCategory = useCallback((catId: string) => {
  setActiveCategories(prev => {
    const allCats = new Set(categories.map(c => c.id));
    // If this is already the only active one, reset to show all
    if (prev.size === 1 && prev.has(catId)) {
      return allCats;
    }
    // Otherwise, show only this category
    return new Set([catId]);
  });
}, []);
```

This is a single-line logic change — no other files need modification. The existing `filteredEvents` memo already filters by `activeCategories`, so the map will automatically show only the selected category's events.

