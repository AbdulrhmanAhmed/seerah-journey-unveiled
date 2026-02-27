export interface PathStep {
  order: number;
  locationId?: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  x: number;
  y: number;
  segmentType: "land" | "sea";
}

export interface MapPath {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  lineColor: string;
  steps: PathStep[];
}

// Projection: x = (lon - 28) * 7.4,  y = (38 - lat) * 5.36
// ViewBox: 0 0 200 150

export const mapPaths: MapPath[] = [
  {
    id: "hijrah",
    name: "طريق الهجرة",
    nameEn: "The Hijrah",
    description: "رحلة النبي ﷺ من مكة إلى المدينة عبر غار ثور وقباء — الحدث الذي غيّر مجرى التاريخ.",
    descriptionEn: "The Prophet's ﷺ journey from Makkah to Madinah via Cave Thawr and Quba — the event that changed the course of history.",
    lineColor: "46 56% 52%",
    steps: [
      {
        order: 1,
        locationId: "makkah",
        label: "الخروج من مكة",
        labelEn: "Departure from Makkah",
        description: "خرج النبي ﷺ سراً من بيته متوجهاً جنوباً نحو غار ثور.",
        descriptionEn: "The Prophet ﷺ secretly left his house heading south towards Cave Thawr.",
        x: 87.5,
        y: 88.8,
        segmentType: "land",
      },
      {
        order: 2,
        locationId: "cave-thawr",
        label: "غار ثور",
        labelEn: "Cave Thawr",
        description: "اختبأ النبي ﷺ وأبو بكر رضي الله عنه ثلاثة أيام حتى هدأت المطاردة.",
        descriptionEn: "The Prophet ﷺ and Abu Bakr hid for three days until the pursuit subsided.",
        x: 87.8,
        y: 90.5,
        segmentType: "land",
      },
      {
        order: 3,
        locationId: "quba",
        label: "قباء",
        labelEn: "Quba",
        description: "وصل النبي ﷺ قباء وأسس أول مسجد في الإسلام.",
        descriptionEn: "The Prophet ﷺ arrived at Quba and established the first mosque in Islam.",
        x: 85.8,
        y: 73.2,
        segmentType: "land",
      },
      {
        order: 4,
        locationId: "madinah",
        label: "الوصول إلى المدينة",
        labelEn: "Arrival in Madinah",
        description: "استقبله أهل المدينة بالأناشيد — «طلع البدر علينا».",
        descriptionEn: "The people of Madinah welcomed him with chants — 'Tala'al Badru Alayna'.",
        x: 85.9,
        y: 72.5,
        segmentType: "land",
      },
    ],
  },
  {
    id: "taif",
    name: "رحلة الطائف",
    nameEn: "Journey to Ta'if",
    description: "سعى النبي ﷺ للنصرة في الطائف بعد عام الحزن، فواجه الرفض والأذى.",
    descriptionEn: "The Prophet ﷺ sought support in Ta'if after the Year of Sorrow, but faced rejection and harm.",
    lineColor: "30 80% 50%",
    steps: [
      {
        order: 1,
        locationId: "makkah",
        label: "الانطلاق من مكة",
        labelEn: "Departure from Makkah",
        description: "بعد وفاة خديجة وأبي طالب، توجه النبي ﷺ إلى الطائف طلباً للنصرة.",
        descriptionEn: "After the deaths of Khadijah and Abu Talib, the Prophet ﷺ headed to Ta'if seeking support.",
        x: 87.5,
        y: 88.8,
        segmentType: "land",
      },
      {
        order: 2,
        locationId: "taif",
        label: "الوصول إلى الطائف",
        labelEn: "Arrival in Ta'if",
        description: "رفضه أهل الطائف ورجموه بالحجارة حتى أدميت قدماه ﷺ.",
        descriptionEn: "The people of Ta'if rejected him and stoned him until his feet bled ﷺ.",
        x: 92.0,
        y: 89.6,
        segmentType: "land",
      },
      {
        order: 3,
        label: "بستان عداس",
        labelEn: "Garden of Addas",
        description: "استراح في بستان حيث لقي عداساً النصراني الذي أسلم بعد حوار قصير.",
        descriptionEn: "He rested in a garden where he met Addas, a Christian who accepted Islam after a brief dialogue.",
        x: 90.5,
        y: 89.2,
        segmentType: "land",
      },
      {
        order: 4,
        locationId: "makkah",
        label: "العودة إلى مكة",
        labelEn: "Return to Makkah",
        description: "عاد النبي ﷺ إلى مكة تحت جوار المطعم بن عدي.",
        descriptionEn: "The Prophet ﷺ returned to Makkah under the protection of Mut'im ibn Adi.",
        x: 87.5,
        y: 88.8,
        segmentType: "land",
      },
    ],
  },
  {
    id: "abyssinia",
    name: "الهجرة إلى الحبشة",
    nameEn: "Migration to Abyssinia",
    description: "هاجر المسلمون الأوائل عبر البحر الأحمر إلى الحبشة هرباً من اضطهاد قريش.",
    descriptionEn: "The early Muslims migrated across the Red Sea to Abyssinia, fleeing persecution by Quraysh.",
    lineColor: "200 60% 50%",
    steps: [
      {
        order: 1,
        locationId: "makkah",
        label: "الخروج من مكة",
        labelEn: "Departure from Makkah",
        description: "أمر النبي ﷺ أصحابه بالهجرة إلى أرض الحبشة حيث ملك عادل.",
        descriptionEn: "The Prophet ﷺ instructed his companions to emigrate to the land of Abyssinia where there was a just king.",
        x: 87.5,
        y: 88.8,
        segmentType: "land",
      },
      {
        order: 2,
        label: "ساحل البحر الأحمر",
        labelEn: "Red Sea Coast",
        description: "وصل المهاجرون إلى الساحل وركبوا السفن متجهين إلى الحبشة.",
        descriptionEn: "The emigrants reached the coast and boarded ships heading to Abyssinia.",
        x: 75,
        y: 93,
        segmentType: "land",
      },
      {
        order: 3,
        label: "عبور البحر الأحمر",
        labelEn: "Crossing the Red Sea",
        description: "أبحروا عبر البحر الأحمر في رحلة محفوفة بالمخاطر.",
        descriptionEn: "They sailed across the Red Sea in a perilous journey.",
        x: 70,
        y: 110,
        segmentType: "sea",
      },
      {
        order: 4,
        locationId: "abyssinia",
        label: "بلاط النجاشي",
        labelEn: "Court of the Negus",
        description: "تلا جعفر بن أبي طالب سورة مريم أمام النجاشي فأجارهم.",
        descriptionEn: "Ja'far ibn Abi Talib recited Surah Maryam before the Negus, who granted them protection.",
        x: 79.6,
        y: 128.0,
        segmentType: "land",
      },
    ],
  },
];
