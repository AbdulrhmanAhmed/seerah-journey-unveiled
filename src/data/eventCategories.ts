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
  icon: string; // Lucide icon name
  colorHsl: string; // HSL values for the category
}

export const categories: CategoryConfig[] = [
  { id: "milestone", label: "Milestone", icon: "Star", colorHsl: "46 56% 52%" },
  { id: "battle", label: "Battle", icon: "Swords", colorHsl: "0 72% 50%" },
  { id: "contract", label: "Treaty / Contract", icon: "FileText", colorHsl: "200 60% 50%" },
  { id: "challenge", label: "Challenge", icon: "AlertCircle", colorHsl: "30 80% 50%" },
  { id: "marriage", label: "Marriage", icon: "Heart", colorHsl: "330 60% 55%" },
  { id: "diplomacy", label: "Diplomacy", icon: "Send", colorHsl: "160 50% 40%" },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<EventCategory, CategoryConfig>;
