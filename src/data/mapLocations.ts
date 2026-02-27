import type { EventCategory } from "./eventCategories";

export interface LocationEvent {
  label: string;
  labelEn: string;
  category: EventCategory;
}

export interface MapLocation {
  id: string;
  name: string;
  nameEn: string;
  nameArabic: string;
  x: number;
  y: number;
  description: string;
  descriptionEn: string;
  events: LocationEvent[];
  primaryCategory: EventCategory;
  travel: {
    camelDays: string;
    camelDaysEn: string;
    carHours: string;
    carHoursEn: string;
    distanceKm: number;
    from: string;
    fromEn: string;
  };
}

export const mapLocations: MapLocation[] = [
  {
    id: "makkah",
    name: "مكة",
    nameEn: "Makkah",
    nameArabic: "مكة المكرمة",
    x: 38.5,
    y: 62,
    description: "أقدس مدينة في الإسلام، مسقط رأس النبي ﷺ، وموطن المسجد الحرام والكعبة المشرفة.",
    descriptionEn: "The holiest city in Islam, birthplace of the Prophet ﷺ, and home to the Sacred Mosque and the Ka'bah.",
    primaryCategory: "milestone",
    events: [
      { label: "مولد النبي ﷺ (٥٧٠ م)", labelEn: "Birth of the Prophet ﷺ (570 CE)", category: "milestone" },
      { label: "نزول الوحي في غار حراء (٦١٠ م)", labelEn: "First Revelation in Cave Hira (610 CE)", category: "milestone" },
      { label: "الزواج من خديجة رضي الله عنها (٥٩٥ م)", labelEn: "Marriage to Khadijah (595 CE)", category: "marriage" },
      { label: "الجهر بالدعوة (٦١٣ م)", labelEn: "Public Declaration (613 CE)", category: "milestone" },
      { label: "حصار بني هاشم (٦١٦–٦١٩ م)", labelEn: "Boycott of Banu Hashim (616–619 CE)", category: "challenge" },
      { label: "ليلة الإسراء (٦٢٠ م)", labelEn: "Night Journey (620 CE)", category: "milestone" },
      { label: "فتح مكة (٦٣٠ م)", labelEn: "Conquest of Makkah (630 CE)", category: "milestone" },
      { label: "حجة الوداع (٦٣٢ م)", labelEn: "Farewell Pilgrimage (632 CE)", category: "milestone" },
    ],
    travel: { camelDays: "—", camelDaysEn: "—", carHours: "—", carHoursEn: "—", distanceKm: 0, from: "نقطة الأصل", fromEn: "Origin" },
  },
  {
    id: "madinah",
    name: "المدينة",
    nameEn: "Madinah",
    nameArabic: "المدينة المنورة",
    x: 37,
    y: 47.5,
    description: "«المدينة المنورة» — وجهة الهجرة ومقر أول دولة إسلامية. موطن المسجد النبوي.",
    descriptionEn: "The Illuminated City — destination of the Hijrah and seat of the first Islamic state. Home to the Prophet's Mosque.",
    primaryCategory: "milestone",
    events: [
      { label: "الهجرة — وصول النبي ﷺ (٦٢٢ م)", labelEn: "Hijrah — Arrival of the Prophet ﷺ (622 CE)", category: "milestone" },
      { label: "دستور المدينة (٦٢٢ م)", labelEn: "Constitution of Madinah (622 CE)", category: "contract" },
      { label: "الزواج من عائشة رضي الله عنها (٢ هـ)", labelEn: "Marriage to Aisha (2 AH)", category: "marriage" },
      { label: "غزوة بدر (٦٢٤ م)", labelEn: "Battle of Badr (624 CE)", category: "battle" },
      { label: "غزوة أحد (٦٢٥ م)", labelEn: "Battle of Uhud (625 CE)", category: "battle" },
      { label: "غزوة الخندق (٦٢٧ م)", labelEn: "Battle of the Trench (627 CE)", category: "battle" },
      { label: "رسائل إلى الملوك (٦–٨ هـ)", labelEn: "Letters to Kings (6–8 AH)", category: "diplomacy" },
      { label: "وفاة النبي ﷺ (٦٣٢ م)", labelEn: "Passing of the Prophet ﷺ (632 CE)", category: "milestone" },
    ],
    travel: { camelDays: "~١١ يوماً", camelDaysEn: "~11 days", carHours: "~٤٫٥ ساعات", carHoursEn: "~4.5 hours", distanceKm: 450, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "taif",
    name: "الطائف",
    nameEn: "Ta'if",
    nameArabic: "الطائف",
    x: 41,
    y: 64.5,
    description: "مدينة جبلية سعى فيها النبي ﷺ للدعم بعد عام الحزن لكنه قوبل بالرفض.",
    descriptionEn: "A mountain city where the Prophet ﷺ sought support after the Year of Sorrow but was rejected.",
    primaryCategory: "challenge",
    events: [
      { label: "رحلة النبي ﷺ طلباً للنصرة (٦١٩ م)", labelEn: "The Prophet's ﷺ journey seeking support (619 CE)", category: "challenge" },
      { label: "رجمه من سفهاء ثقيف", labelEn: "Stoned by the people of Thaqif", category: "challenge" },
      { label: "دعاء الطائف المشهور", labelEn: "The famous supplication of Ta'if", category: "milestone" },
      { label: "إسلام ثقيف لاحقاً (٦٣١ م)", labelEn: "Thaqif embraced Islam later (631 CE)", category: "diplomacy" },
    ],
    travel: { camelDays: "~يومان", camelDaysEn: "~2 days", carHours: "~١٫٥ ساعة", carHoursEn: "~1.5 hours", distanceKm: 120, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "abyssinia",
    name: "الحبشة",
    nameEn: "Abyssinia",
    nameArabic: "الحبشة",
    x: 56,
    y: 78,
    description: "إثيوبيا حالياً — أرض الملك العادل النجاشي الذي أوى المهاجرين المسلمين الأوائل.",
    descriptionEn: "Modern-day Ethiopia — land of the just King Negus who sheltered the early Muslim emigrants.",
    primaryCategory: "diplomacy",
    events: [
      { label: "الهجرة الأولى للمسلمين (٦١٥ م)", labelEn: "First Muslim emigration (615 CE)", category: "milestone" },
      { label: "تلاوة جعفر لسورة مريم", labelEn: "Ja'far's recitation of Surah Maryam", category: "diplomacy" },
      { label: "فشل محاولة مبعوثي قريش", labelEn: "Quraysh envoys' failed attempt", category: "challenge" },
      { label: "حماية النجاشي للمسلمين", labelEn: "Negus's protection of Muslims", category: "contract" },
    ],
    travel: { camelDays: "~٣٠+ يوماً (بحراً وبراً)", camelDaysEn: "~30+ days (by sea and land)", carHours: "~٢٤ ساعة", carHoursEn: "~24 hours", distanceKm: 1400, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "jerusalem",
    name: "القدس",
    nameEn: "Jerusalem",
    nameArabic: "القدس",
    x: 52,
    y: 32,
    description: "مدينة القدس المباركة، موطن المسجد الأقصى — وجهة رحلة الإسراء.",
    descriptionEn: "The blessed city of Jerusalem, home to Al-Aqsa Mosque — destination of the Night Journey.",
    primaryCategory: "milestone",
    events: [
      { label: "ليلة الإسراء (٦٢٠ م)", labelEn: "Night Journey (620 CE)", category: "milestone" },
      { label: "صلاة النبي ﷺ إماماً بالأنبياء", labelEn: "The Prophet ﷺ led all Prophets in prayer", category: "milestone" },
      { label: "القبلة الأولى للمسلمين", labelEn: "First Qiblah of Muslims", category: "milestone" },
    ],
    travel: { camelDays: "~٣٠ يوماً", camelDaysEn: "~30 days", carHours: "~١٥ ساعة", carHoursEn: "~15 hours", distanceKm: 1235, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "badr",
    name: "بدر",
    nameEn: "Badr",
    nameArabic: "بدر",
    x: 36,
    y: 55,
    description: "موقع أول معركة حاسمة بين المسلمين وقريش، نصر معجز للمؤمنين.",
    descriptionEn: "Site of the first decisive battle between Muslims and Quraysh — a miraculous victory for the believers.",
    primaryCategory: "battle",
    events: [
      { label: "غزوة بدر (٦٢٤ م / ٢ هـ)", labelEn: "Battle of Badr (624 CE / 2 AH)", category: "battle" },
      { label: "٣١٣ مسلماً ضد +١٠٠٠ من قريش", labelEn: "313 Muslims vs 1,000+ Quraysh", category: "battle" },
    ],
    travel: { camelDays: "~٣ أيام", camelDaysEn: "~3 days", carHours: "~٣ ساعات", carHoursEn: "~3 hours", distanceKm: 150, from: "المدينة", fromEn: "Madinah" },
  },
  {
    id: "hudaybiyyah",
    name: "الحديبية",
    nameEn: "Hudaybiyyah",
    nameArabic: "الحديبية",
    x: 37,
    y: 63,
    description: "موقع المعاهدة التاريخية بين النبي ﷺ وقريش — وصفها القرآن بـ«الفتح المبين».",
    descriptionEn: "Site of the historic treaty between the Prophet ﷺ and Quraysh — described by the Quran as a 'Clear Victory'.",
    primaryCategory: "contract",
    events: [
      { label: "صلح الحديبية (٦٢٨ م / ٦ هـ)", labelEn: "Treaty of Hudaybiyyah (628 CE / 6 AH)", category: "contract" },
      { label: "بيعة الرضوان تحت الشجرة", labelEn: "Pledge of Ridwan under the tree", category: "milestone" },
    ],
    travel: { camelDays: "~يوم واحد", camelDaysEn: "~1 day", carHours: "~٣٠ دقيقة", carHoursEn: "~30 minutes", distanceKm: 22, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "cave-thawr",
    name: "غار ثور",
    nameEn: "Cave Thawr",
    nameArabic: "غار ثور",
    x: 38,
    y: 64,
    description: "الغار الذي اختبأ فيه النبي ﷺ وأبو بكر رضي الله عنه ثلاثة أيام أثناء الهجرة.",
    descriptionEn: "The cave where the Prophet ﷺ and Abu Bakr hid for three days during the Hijrah.",
    primaryCategory: "milestone",
    events: [
      { label: "الاختباء ثلاثة أيام (٦٢٢ م)", labelEn: "Three-day concealment (622 CE)", category: "milestone" },
      { label: "نسج العنكبوت وعش الحمام", labelEn: "Spider's web and dove's nest", category: "milestone" },
    ],
    travel: { camelDays: "~ساعات", camelDaysEn: "~hours", carHours: "~٢٠ دقيقة", carHoursEn: "~20 minutes", distanceKm: 8, from: "مكة", fromEn: "Makkah" },
  },
  {
    id: "quba",
    name: "قباء",
    nameEn: "Quba",
    nameArabic: "قباء",
    x: 36,
    y: 49,
    description: "موقع أول مسجد بُني في الإسلام — مسجد قباء، الذي أسسه النبي ﷺ عند وصوله من الهجرة.",
    descriptionEn: "Site of the first mosque built in Islam — Quba Mosque, founded by the Prophet ﷺ upon arriving from the Hijrah.",
    primaryCategory: "milestone",
    events: [
      { label: "بناء مسجد قباء (٦٢٢ م)", labelEn: "Building of Quba Mosque (622 CE)", category: "milestone" },
      { label: "أول صلاة جمعة في الإسلام", labelEn: "First Friday prayer in Islam", category: "milestone" },
    ],
    travel: { camelDays: "~١٠ أيام", camelDaysEn: "~10 days", carHours: "~٤ ساعات", carHoursEn: "~4 hours", distanceKm: 440, from: "مكة", fromEn: "Makkah" },
  },
];

export const hijrahRoute = [
  { x: 38.5, y: 62 },
  { x: 38, y: 60.5 },
  { x: 34, y: 58 },
  { x: 32, y: 55 },
  { x: 33, y: 52 },
  { x: 35, y: 49 },
  { x: 37, y: 47.5 },
];
