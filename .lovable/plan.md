

## Problem

The Character page imports `dynamicIconImports` from `lucide-react/dynamicIconImports`, which triggers hundreds of lazy-loaded icon module requests. This overwhelms the browser, causing:
- Page load timeout (15+ seconds)
- The React Query for `shamail_traits` either never fires or never resolves
- The page stays stuck on the loading skeleton forever

The Journey/Interactive Journey pages work correctly (confirmed via browser testing) since they don't use dynamic icon imports.

## Solution

Replace the heavy `dynamicIconImports` approach with a **static icon map** that only includes the icons actually used in the project.

### File: `src/pages/CharacterPage.tsx`

1. **Remove** the imports of `lazy`, `Suspense`, and `dynamicIconImports`
2. **Add** direct imports for commonly used Lucide icons (heart, star, shield, users, book-open, hand-heart, eye, smile, crown, etc.)
3. **Replace** the `DynIcon` component with a simple lookup from a static `Record<string, LucideIcon>` map
4. If the `icon_name` from the database doesn't match any entry in the map, fall back to a `Heart` icon

This eliminates hundreds of module requests and allows the page to load instantly, letting the Supabase query fire and display the 5 traits.

### No database or RLS changes needed
The RLS policies are already correctly set to PERMISSIVE (verified via `pg_policy` query). The database contains 5 active traits and 255 active events. The issue is purely a frontend performance/blocking problem.

