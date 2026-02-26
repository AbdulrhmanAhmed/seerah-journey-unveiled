export interface MapLocation {
  id: string;
  name: string;
  nameArabic: string;
  x: number; // percentage position on SVG
  y: number;
  description: string;
  events: string[];
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
    events: [
      "Birth of the Prophet ﷺ (570 CE)",
      "The First Revelation in Cave Hira (610 CE)",
      "The public call to Islam (613 CE)",
      "The Night Journey — Al-Isra' (620 CE)",
      "The Conquest of Makkah (630 CE)",
      "The Farewell Pilgrimage (632 CE)",
    ],
    travel: {
      camelDays: "—",
      carHours: "—",
      distanceKm: 0,
      from: "Origin",
    },
  },
  {
    id: "madinah",
    name: "Madinah",
    nameArabic: "المدينة المنورة",
    x: 37,
    y: 47.5,
    description:
      "The 'Radiant City' — destination of the Hijrah and seat of the first Muslim state. Home to Masjid al-Nabawi, where the Prophet ﷺ is buried.",
    events: [
      "The Hijrah — arrival of the Prophet ﷺ (622 CE)",
      "Building of Masjid al-Nabawi",
      "The Constitution of Madinah",
      "The Battle of Badr (624 CE)",
      "The Battle of Uhud (625 CE)",
      "The Battle of the Trench (627 CE)",
      "The passing of the Prophet ﷺ (632 CE)",
    ],
    travel: {
      camelDays: "~11 days",
      carHours: "~4.5 hours",
      distanceKm: 450,
      from: "Makkah",
    },
  },
  {
    id: "taif",
    name: "Ta'if",
    nameArabic: "الطائف",
    x: 41,
    y: 64.5,
    description:
      "A mountain city southeast of Makkah where the Prophet ﷺ sought support after the Year of Sorrow but was met with rejection.",
    events: [
      "The Prophet's ﷺ journey seeking support (619 CE)",
      "Stoning by the youth of Thaqif",
      "The famous supplication of Ta'if",
      "Later acceptance of Islam by the people of Ta'if (631 CE)",
    ],
    travel: {
      camelDays: "~2 days",
      carHours: "~1.5 hours",
      distanceKm: 120,
      from: "Makkah",
    },
  },
  {
    id: "abyssinia",
    name: "Abyssinia",
    nameArabic: "الحبشة",
    x: 56,
    y: 78,
    description:
      "Modern-day Ethiopia/Eritrea — the land of the just Christian king, the Negus (al-Najashi), who sheltered the early Muslim emigrants.",
    events: [
      "First Migration of Muslims (615 CE)",
      "Second Migration — larger group (~80 people)",
      "Quraysh envoys' failed attempt to retrieve Muslims",
      "Ja'far ibn Abi Talib's recitation of Surah Maryam",
    ],
    travel: {
      camelDays: "~30+ days (incl. sea crossing)",
      carHours: "~24 hours (modern routes)",
      distanceKm: 1400,
      from: "Makkah",
    },
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    nameArabic: "القدس",
    x: 52,
    y: 32,
    description:
      "The blessed city of Al-Quds, home of Masjid al-Aqsa — the destination of the Night Journey (al-Isra').",
    events: [
      "Destination of the Night Journey — Al-Isra' (620 CE)",
      "The Prophet ﷺ led all prophets in prayer",
      "First Qiblah of the Muslims",
    ],
    travel: {
      camelDays: "~30 days",
      carHours: "~15 hours",
      distanceKm: 1235,
      from: "Makkah",
    },
  },
];

// Hijrah route waypoints (Makkah → Cave Thawr → coastal route → Madinah)
export const hijrahRoute = [
  { x: 38.5, y: 62 },   // Makkah
  { x: 38, y: 60.5 },    // Cave of Thawr
  { x: 34, y: 58 },      // Coastal detour west
  { x: 32, y: 55 },      // Along the coast
  { x: 33, y: 52 },      // Turning north-east
  { x: 35, y: 49 },      // Approaching
  { x: 37, y: 47.5 },    // Madinah
];
