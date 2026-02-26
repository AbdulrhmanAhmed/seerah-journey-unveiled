export type EventCategory =
  | "milestone"
  | "battle"
  | "contract"
  | "challenge"
  | "marriage"
  | "diplomacy";

export interface CategoryConfig {
  id: EventCategory;
  label: string;
  icon: string;
  colorHsl: string;
}

export const categories: CategoryConfig[] = [
  { id: "milestone", label: "حدث بارز", icon: "Star", colorHsl: "46 56% 52%" },
  { id: "battle", label: "غزوة", icon: "Swords", colorHsl: "0 72% 50%" },
  { id: "contract", label: "عهد / معاهدة", icon: "FileText", colorHsl: "200 60% 50%" },
  { id: "challenge", label: "ابتلاء", icon: "AlertCircle", colorHsl: "30 80% 50%" },
  { id: "marriage", label: "زواج", icon: "Heart", colorHsl: "330 60% 55%" },
  { id: "diplomacy", label: "دبلوماسية", icon: "Send", colorHsl: "160 50% 40%" },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<EventCategory, CategoryConfig>;