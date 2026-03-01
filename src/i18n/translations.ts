export type Language = "ar" | "en";

export const translations = {
  ar: {
    // Navbar
    siteName: "مسار السيرة",
    navJourney: "الرحلة",
    navCharacter: "الشمائل",
    navMap: "الخريطة",
    navInteractiveJourney: "الرحلة التفاعلية",
    navLibrary: "المكتبة",
    menuLabel: "القائمة",

    // Hero
    bismillah: "بسم الله الرحمن الرحيم",
    heroTitle: "السلام عليكم",
    heroTitleItalic: "أيها المسافر",
    heroSubtitle: "استكشف حياة خاتم الأنبياء والمرسلين ﷺ",
    heroDescription: "رحلة عبر السيرة النبوية الشريفة — رسالته، أخلاقه، والعالم الذي غيّره ﷺ",
    heroButton: "ابدأ رحلتك",

    // Pillars
    pillarsTitle: "الأركان الأربعة",
    pillarsSubtitle: "تنقّل في السيرة النبوية من خلال أربعة أبعاد مترابطة — كل منها باب نحو فهم أعمق.",
    pillarsExplore: "استكشف",
    pillarJourneyDesc: "تتبّع الخط الزمني لحياة النبي ﷺ — من ولادته في مكة إلى تأسيس دولة الإسلام في المدينة.",
    pillarCharacterDesc: "اكتشف الصفات النبيلة والتعاليم والحكمة الخالدة لخير الخلق ﷺ.",
    pillarMapDesc: "استكشف الأراضي والطرق والأماكن المقدسة المرتبطة بالرسالة النبوية.",
    pillarLibraryDesc: "اطّلع على المصادر الموثقة والأعمال العلمية والموارد المتعددة حول السيرة.",

    // Footer
    footerSourcesTitle: "المصادر والتوثيق",
    footerSourcesText: "كل محتوى في «مسار السيرة» مبني على مصادر علمية موثقة. نعتمد على المؤلفات الكلاسيكية مثل الرحيق المختوم، والسيرة النبوية لابن هشام، ومجموعات الحديث المعتمدة كصحيح البخاري وصحيح مسلم.",
    footerReviewed: "محتوى مراجع علمياً",
    footerVerified: "مصادر موثقة فقط",
    footerScholarly: "مراجع علمية",
    footerCopyright: "بُني بإتقان وأمانة.",

    // Map Page
    mapTitle: "الخريطة",
    mapSubtitle: "استكشف الأراضي التي شكّلت الرسالة النبوية. انقر على أي موقع لتكتشف قصته.",
    mapShowRoute: "عرض مسار الهجرة",
    mapHideRoute: "إخفاء مسار الهجرة",
    mapRouteLegend: "مسار الهجرة (٦٢٢ م)",
    mapHijrahRoute: "مسار الهجرة",
    mapJourneys: "المسارات",
    mapPlayPath: "تشغيل المسار",
    mapStepOf: "الخطوة",
    mapOf: "من",

    // Journey Page
    journeyTitle: "الرحلة",
    journeySubtitle: "تنقّل عبر حياة النبي محمد ﷺ — من المولد المبارك في مكة إلى تأسيس أمة في المدينة.",
    journeyMakkahEra: "العهد المكي · ٥٧٠–٦٢٢ م",
    journeyMadinahEra: "العهد المدني · ٦٢٢–٦٣٢ م",
    journeyReadMore: "اقرأ المزيد",
    journeyMakkah: "العهد المكي",
    journeyMadinah: "العهد المدني",
    journeyDetails: "تفاصيل",

    // Character / Shamail Page
    characterTitle: "الشمائل المحمدية",
    characterSubtitle: "استكشف صفات سيد الخلق ﷺ",
    shamailTraitOfDay: "صفة اليوم",
    shamailFromGuidance: "من هدي النبي ﷺ",
    shamailTheySaid: "قالوا عنه",
    shamailReflection: "تأمل",
    shamailViewOnMap: "عرض الموقع على الخريطة",
    shamailCategoryAll: "الكل",
    shamailCategoryMoral: "الصفات الخُلقية",
    shamailCategoryPhysical: "الصفات الخَلقية",
    shamailCategorySocial: "التعاملات الاجتماعية",

    // Library Page
    libraryTitle: "المكتبة",
    librarySubtitle: "مجموعة منتقاة من مصادر السيرة الموثقة قيد الإعداد لكم.",

    // Location Card
    locationEvents: "الأحداث الرئيسية",
    locationDistanceFrom: "المسافة من",
    locationByCamel: "بالجمل",
    locationByCar: "بالسيارة اليوم",
    locationDistance: "المسافة",
    locationKm: "كم",

    // Map Filter
    filterCategories: "تصفية الفئات",
    filterByCategory: "تصفية حسب الفئة",

    // Quick Nav
    quickNavJumpTo: "انتقل إلى",

    // Map regions
    regionNajd: "نجد",
    regionHijaz: "الحجاز",
    regionYemen: "اليمن",
    regionRedSea: "البحر الأحمر",
    regionHornOfAfrica: "القرن الأفريقي",
    viewLocation: "عرض",

    // Categories
    catMilestone: "حدث بارز",
    catBattle: "غزوة",
    catContract: "عهد / معاهدة",
    catChallenge: "ابتلاء",
    catMarriage: "زواج",
    catDiplomacy: "دبلوماسية",
  },
  en: {
    siteName: "Seerah Path",
    navJourney: "Journey",
    navCharacter: "Character",
    navMap: "Map",
    navInteractiveJourney: "Interactive Journey",
    navLibrary: "Library",
    menuLabel: "Menu",

    bismillah: "In the Name of God, the Most Gracious, the Most Merciful",
    heroTitle: "Peace be upon you,",
    heroTitleItalic: "Traveler",
    heroSubtitle: "Explore the life of the Final Prophet ﷺ",
    heroDescription: "A journey through the Noble Prophetic Biography — his message, his character, and the world he transformed ﷺ",
    heroButton: "Begin Your Journey",

    pillarsTitle: "The Four Pillars",
    pillarsSubtitle: "Navigate the Prophetic biography through four interconnected dimensions — each a gateway to deeper understanding.",
    pillarsExplore: "Explore",
    pillarJourneyDesc: "Trace the timeline of the Prophet's ﷺ life — from his birth in Makkah to establishing the Islamic state in Madinah.",
    pillarCharacterDesc: "Discover the noble qualities, teachings, and timeless wisdom of the best of creation ﷺ.",
    pillarMapDesc: "Explore the lands, routes, and sacred places connected to the Prophetic mission.",
    pillarLibraryDesc: "Browse verified sources, scholarly works, and diverse resources on the Seerah.",

    footerSourcesTitle: "Sources & Documentation",
    footerSourcesText: "All content in Seerah Path is built on verified scholarly sources. We rely on classical works such as The Sealed Nectar, Ibn Hisham's Seerah, and authenticated hadith collections like Sahih al-Bukhari and Sahih Muslim.",
    footerReviewed: "Scholarly reviewed content",
    footerVerified: "Verified sources only",
    footerScholarly: "Academic references",
    footerCopyright: "Built with care and integrity.",

    mapTitle: "The Map",
    mapSubtitle: "Explore the lands that shaped the Prophetic mission. Click any location to discover its story.",
    mapShowRoute: "Show Hijrah Route",
    mapHideRoute: "Hide Hijrah Route",
    mapRouteLegend: "Hijrah Route (622 CE)",
    mapHijrahRoute: "Hijrah Route",
    mapJourneys: "Journeys",
    mapPlayPath: "Play Path",
    mapStepOf: "Step",
    mapOf: "of",

    journeyTitle: "The Journey",
    journeySubtitle: "Navigate through the life of Prophet Muhammad ﷺ — from his blessed birth in Makkah to founding a nation in Madinah.",
    journeyMakkahEra: "Makkan Period · 570–622 CE",
    journeyMadinahEra: "Madinan Period · 622–632 CE",
    journeyReadMore: "Read More",
    journeyMakkah: "Makkan Period",
    journeyMadinah: "Madinan Period",
    journeyDetails: "Details of",

    characterTitle: "Prophetic Traits",
    characterSubtitle: "Discover the noble qualities of the Prophet ﷺ",
    shamailTraitOfDay: "Trait of the Day",
    shamailFromGuidance: "From the Prophet's Guidance ﷺ",
    shamailTheySaid: "What They Said",
    shamailReflection: "Reflection",
    shamailViewOnMap: "View on Map",
    shamailCategoryAll: "All",
    shamailCategoryMoral: "Moral",
    shamailCategoryPhysical: "Physical",
    shamailCategorySocial: "Social",

    libraryTitle: "The Library",
    librarySubtitle: "A curated collection of verified Seerah sources is being prepared for you.",

    locationEvents: "Key Events",
    locationDistanceFrom: "Distance from",
    locationByCamel: "By Camel",
    locationByCar: "By Car Today",
    locationDistance: "Distance",
    locationKm: "km",

    filterCategories: "Filter Categories",
    filterByCategory: "Filter by Category",

    quickNavJumpTo: "Jump to",

    regionNajd: "Najd",
    regionHijaz: "Hijaz",
    regionYemen: "Yemen",
    regionRedSea: "Red Sea",
    regionHornOfAfrica: "Horn of Africa",
    viewLocation: "View",

    catMilestone: "Milestone",
    catBattle: "Battle",
    catContract: "Treaty / Pact",
    catChallenge: "Trial",
    catMarriage: "Marriage",
    catDiplomacy: "Diplomacy",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;
