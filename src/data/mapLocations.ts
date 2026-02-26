import type { EventCategory } from "./eventCategories";

export interface LocationEvent {
  label: string;
  category: EventCategory;
}

export interface MapLocation {
  id: string;
  name: string;
  nameArabic: string;
  x: number;
  y: number;
  description: string;
  events: LocationEvent[];
  primaryCategory: EventCategory;
  travel: {
    camelDays: string;
    carHours: string;
    distanceKm: number;
    from: string;
  };
}

export const mapLocations: MapLocation[] = [
  {
    id: "makkah",
    name: "Makkah",
    nameArabic: "مكة المكرمة",
    x: 38.5,
    y: 62,
    description:
      "The holiest city in Islam, birthplace of the Prophet ﷺ, and home to the Sacred Mosque (Masjid al-Haram) and the Ka'bah.",
    primaryCategory: "milestone",
    events: [
      { label: "Birth of the Prophet ﷺ (570 CE)", category: "milestone" },
      { label: "The First Revelation in Cave Hira (610 CE)", category: "milestone" },
      { label: "Marriage to Khadijah رضي الله عنها (595 CE)", category: "marriage" },
      { label: "The public call to Islam (613 CE)", category: "milestone" },
      { label: "The Boycott of Banu Hashim (616–619 CE)", category: "challenge" },
      { label: "The Night Journey — Al-Isra' (620 CE)", category: "milestone" },
      { label: "The Conquest of Makkah (630 CE)", category: "milestone" },
      { label: "The Farewell Pilgrimage (632 CE)", category: "milestone" },
    ],
    travel: { camelDays: "—", carHours: "—", distanceKm: 0, from: "Origin" },
  },
  {
    id: "madinah",
    name: "Madinah",
    nameArabic: "المدينة المنورة",
    x: 37,
    y: 47.5,
    description:
      "The 'Radiant City' — destination of the Hijrah and seat of the first Muslim state. Home to Masjid al-Nabawi.",
    primaryCategory: "milestone",
    events: [
      { label: "The Hijrah — arrival of the Prophet ﷺ (622 CE)", category: "milestone" },
      { label: "The Constitution of Madinah (622 CE)", category: "contract" },
      { label: "Marriage to Aisha رضي الله عنها (2 AH)", category: "marriage" },
      { label: "The Battle of Badr (624 CE)", category: "battle" },
      { label: "The Battle of Uhud (625 CE)", category: "battle" },
      { label: "The Battle of the Trench (627 CE)", category: "battle" },
      { label: "Letters to Kings (6–8 AH)", category: "diplomacy" },
      { label: "The passing of the Prophet ﷺ (632 CE)", category: "milestone" },
    ],
    travel: { camelDays: "~11 days", carHours: "~4.5 hours", distanceKm: 450, from: "Makkah" },
  },
  {
    id: "taif",
    name: "Ta'if",
    nameArabic: "الطائف",
    x: 41,
    y: 64.5,
    description:
      "A mountain city where the Prophet ﷺ sought support after the Year of Sorrow but was met with rejection.",
    primaryCategory: "challenge",
    events: [
      { label: "The Prophet's ﷺ journey seeking support (619 CE)", category: "challenge" },
      { label: "Stoning by the youth of Thaqif", category: "challenge" },
      { label: "The famous supplication of Ta'if", category: "milestone" },
      { label: "Later acceptance of Islam (631 CE)", category: "diplomacy" },
    ],
    travel: { camelDays: "~2 days", carHours: "~1.5 hours", distanceKm: 120, from: "Makkah" },
  },
  {
    id: "abyssinia",
    name: "Abyssinia",
    nameArabic: "الحبشة",
    x: 56,
    y: 78,
    description:
      "Modern-day Ethiopia — the land of the just Christian king, the Negus, who sheltered the early Muslim emigrants.",
    primaryCategory: "diplomacy",
    events: [
      { label: "First Migration of Muslims (615 CE)", category: "milestone" },
      { label: "Ja'far's recitation of Surah Maryam", category: "diplomacy" },
      { label: "Quraysh envoys' failed attempt", category: "challenge" },
      { label: "Protection granted by the Negus", category: "contract" },
    ],
    travel: { camelDays: "~30+ days (incl. sea)", carHours: "~24 hours", distanceKm: 1400, from: "Makkah" },
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    nameArabic: "القدس",
    x: 52,
    y: 32,
    description:
      "The blessed city of Al-Quds, home of Masjid al-Aqsa — destination of the Night Journey.",
    primaryCategory: "milestone",
    events: [
      { label: "The Night Journey — Al-Isra' (620 CE)", category: "milestone" },
      { label: "The Prophet ﷺ led all prophets in prayer", category: "milestone" },
      { label: "First Qiblah of the Muslims", category: "milestone" },
    ],
    travel: { camelDays: "~30 days", carHours: "~15 hours", distanceKm: 1235, from: "Makkah" },
  },
  {
    id: "badr",
    name: "Badr",
    nameArabic: "بدر",
    x: 36,
    y: 55,
    description:
      "The site of the first decisive battle between the Muslims and the Quraysh, a miraculous victory for the believers.",
    primaryCategory: "battle",
    events: [
      { label: "The Battle of Badr (624 CE / 2 AH)", category: "battle" },
      { label: "313 Muslims vs. 1,000+ Quraysh", category: "battle" },
    ],
    travel: { camelDays: "~3 days", carHours: "~3 hours", distanceKm: 150, from: "Madinah" },
  },
  {
    id: "hudaybiyyah",
    name: "Hudaybiyyah",
    nameArabic: "الحديبية",
    x: 37,
    y: 63,
    description:
      "The site of the historic treaty between the Prophet ﷺ and the Quraysh — described by the Quran as 'a clear victory.'",
    primaryCategory: "contract",
    events: [
      { label: "Treaty of Hudaybiyyah (628 CE / 6 AH)", category: "contract" },
      { label: "Pledge of Ridwan under the tree", category: "milestone" },
    ],
    travel: { camelDays: "~1 day", carHours: "~30 min", distanceKm: 22, from: "Makkah" },
  },
];

// Hijrah route waypoints (Makkah → Cave Thawr → coastal route → Madinah)
export const hijrahRoute = [
  { x: 38.5, y: 62 },
  { x: 38, y: 60.5 },
  { x: 34, y: 58 },
  { x: 32, y: 55 },
  { x: 33, y: 52 },
  { x: 35, y: 49 },
  { x: 37, y: 47.5 },
];
