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
  labelEn: string;
  icon: string;
  colorHsl: string;
}

export const categories: CategoryConfig[] = [
  { id: "milestone", label: "حدث بارز", labelEn: "Milestone", icon: "Star", colorHsl: "46 56% 52%" },
  { id: "battle", label: "غزوة", labelEn: "Battle", icon: "Swords", colorHsl: "0 72% 50%" },
  { id: "contract", label: "عهد / معاهدة", labelEn: "Treaty / Pact", icon: "FileText", colorHsl: "200 60% 50%" },
  { id: "challenge", label: "ابتلاء", labelEn: "Trial", icon: "AlertCircle", colorHsl: "30 80% 50%" },
  { id: "marriage", label: "زواج", labelEn: "Marriage", icon: "Heart", colorHsl: "330 60% 55%" },
  { id: "diplomacy", label: "دبلوماسية", labelEn: "Diplomacy", icon: "Send", colorHsl: "160 50% 40%" },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<EventCategory, CategoryConfig>;
