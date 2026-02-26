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
    name: "مكة",
    nameArabic: "مكة المكرمة",
    x: 38.5,
    y: 62,
    description:
      "أقدس مدينة في الإسلام، مسقط رأس النبي ﷺ، وموطن المسجد الحرام والكعبة المشرفة.",
    primaryCategory: "milestone",
    events: [
      { label: "مولد النبي ﷺ (٥٧٠ م)", category: "milestone" },
      { label: "نزول الوحي في غار حراء (٦١٠ م)", category: "milestone" },
      { label: "الزواج من خديجة رضي الله عنها (٥٩٥ م)", category: "marriage" },
      { label: "الجهر بالدعوة (٦١٣ م)", category: "milestone" },
      { label: "حصار بني هاشم (٦١٦–٦١٩ م)", category: "challenge" },
      { label: "ليلة الإسراء (٦٢٠ م)", category: "milestone" },
      { label: "فتح مكة (٦٣٠ م)", category: "milestone" },
      { label: "حجة الوداع (٦٣٢ م)", category: "milestone" },
    ],
    travel: { camelDays: "—", carHours: "—", distanceKm: 0, from: "نقطة الأصل" },
  },
  {
    id: "madinah",
    name: "المدينة",
    nameArabic: "المدينة المنورة",
    x: 37,
    y: 47.5,
    description:
      "«المدينة المنورة» — وجهة الهجرة ومقر أول دولة إسلامية. موطن المسجد النبوي.",
    primaryCategory: "milestone",
    events: [
      { label: "الهجرة — وصول النبي ﷺ (٦٢٢ م)", category: "milestone" },
      { label: "دستور المدينة (٦٢٢ م)", category: "contract" },
      { label: "الزواج من عائشة رضي الله عنها (٢ هـ)", category: "marriage" },
      { label: "غزوة بدر (٦٢٤ م)", category: "battle" },
      { label: "غزوة أحد (٦٢٥ م)", category: "battle" },
      { label: "غزوة الخندق (٦٢٧ م)", category: "battle" },
      { label: "رسائل إلى الملوك (٦–٨ هـ)", category: "diplomacy" },
      { label: "وفاة النبي ﷺ (٦٣٢ م)", category: "milestone" },
    ],
    travel: { camelDays: "~١١ يوماً", carHours: "~٤٫٥ ساعات", distanceKm: 450, from: "مكة" },
  },
  {
    id: "taif",
    name: "الطائف",
    nameArabic: "الطائف",
    x: 41,
    y: 64.5,
    description:
      "مدينة جبلية سعى فيها النبي ﷺ للدعم بعد عام الحزن لكنه قوبل بالرفض.",
    primaryCategory: "challenge",
    events: [
      { label: "رحلة النبي ﷺ طلباً للنصرة (٦١٩ م)", category: "challenge" },
      { label: "رجمه من سفهاء ثقيف", category: "challenge" },
      { label: "دعاء الطائف المشهور", category: "milestone" },
      { label: "إسلام ثقيف لاحقاً (٦٣١ م)", category: "diplomacy" },
    ],
    travel: { camelDays: "~يومان", carHours: "~١٫٥ ساعة", distanceKm: 120, from: "مكة" },
  },
  {
    id: "abyssinia",
    name: "الحبشة",
    nameArabic: "الحبشة",
    x: 56,
    y: 78,
    description:
      "إثيوبيا حالياً — أرض الملك العادل النجاشي الذي أوى المهاجرين المسلمين الأوائل.",
    primaryCategory: "diplomacy",
    events: [
      { label: "الهجرة الأولى للمسلمين (٦١٥ م)", category: "milestone" },
      { label: "تلاوة جعفر لسورة مريم", category: "diplomacy" },
      { label: "فشل محاولة مبعوثي قريش", category: "challenge" },
      { label: "حماية النجاشي للمسلمين", category: "contract" },
    ],
    travel: { camelDays: "~٣٠+ يوماً (بحراً وبراً)", carHours: "~٢٤ ساعة", distanceKm: 1400, from: "مكة" },
  },
  {
    id: "jerusalem",
    name: "القدس",
    nameArabic: "القدس",
    x: 52,
    y: 32,
    description:
      "مدينة القدس المباركة، موطن المسجد الأقصى — وجهة رحلة الإسراء.",
    primaryCategory: "milestone",
    events: [
      { label: "ليلة الإسراء (٦٢٠ م)", category: "milestone" },
      { label: "صلاة النبي ﷺ إماماً بالأنبياء", category: "milestone" },
      { label: "القبلة الأولى للمسلمين", category: "milestone" },
    ],
    travel: { camelDays: "~٣٠ يوماً", carHours: "~١٥ ساعة", distanceKm: 1235, from: "مكة" },
  },
  {
    id: "badr",
    name: "بدر",
    nameArabic: "بدر",
    x: 36,
    y: 55,
    description:
      "موقع أول معركة حاسمة بين المسلمين وقريش، نصر معجز للمؤمنين.",
    primaryCategory: "battle",
    events: [
      { label: "غزوة بدر (٦٢٤ م / ٢ هـ)", category: "battle" },
      { label: "٣١٣ مسلماً ضد +١٠٠٠ من قريش", category: "battle" },
    ],
    travel: { camelDays: "~٣ أيام", carHours: "~٣ ساعات", distanceKm: 150, from: "المدينة" },
  },
  {
    id: "hudaybiyyah",
    name: "الحديبية",
    nameArabic: "الحديبية",
    x: 37,
    y: 63,
    description:
      "موقع المعاهدة التاريخية بين النبي ﷺ وقريش — وصفها القرآن بـ«الفتح المبين».",
    primaryCategory: "contract",
    events: [
      { label: "صلح الحديبية (٦٢٨ م / ٦ هـ)", category: "contract" },
      { label: "بيعة الرضوان تحت الشجرة", category: "milestone" },
    ],
    travel: { camelDays: "~يوم واحد", carHours: "~٣٠ دقيقة", distanceKm: 22, from: "مكة" },
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