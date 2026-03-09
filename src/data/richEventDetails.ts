export interface RichSection {
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  icon?: string;
}

export interface QuranRef {
  surah: string;
  surahEn: string;
  ayah: string;
  textAr: string;
  textEn: string;
}

export interface HadithRef {
  sourceAr: string;
  sourceEn: string;
  textAr: string;
  textEn: string;
}

export interface ScholarlySource {
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
}

export interface RichEventDetail {
  id: string;
  titleAr: string;
  titleEn: string;
  era: "makkah" | "madinah";
  category: string;
  yearAr: string;
  yearEn: string;
  hijriYearAr?: string;
  hijriYearEn?: string;
  summaryAr: string;
  summaryEn: string;
  sections: RichSection[];
  quranRefs: QuranRef[];
  hadithRefs: HadithRef[];
  sources: ScholarlySource[];
  relatedEventIds: string[];
}

export const richEvents: Record<string, RichEventDetail> = {
  birth: {
    id: "birth",
    titleAr: "مولد النبي ﷺ",
    titleEn: "Birth of the Prophet ﷺ",
    era: "makkah",
    category: "milestone",
    yearAr: "٥٧٠ م",
    yearEn: "570 CE",
    hijriYearAr: "قبل الهجرة بـ ٥٣ سنة",
    hijriYearEn: "53 years before Hijrah",
    summaryAr:
      "وُلد سيدنا محمد ﷺ في مكة المكرمة في عام الفيل، في أشرف بيوت العرب: بني هاشم من قبيلة قريش. كانت ولادته إيذاناً ببزوغ فجر جديد للبشرية.",
    summaryEn:
      "Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant, into the noblest household of Arabia: Banu Hashim of Quraysh. His birth heralded a new dawn for humanity.",

    sections: [
      {
        titleAr: "النسب الشريف",
        titleEn: "Noble Lineage",
        icon: "Star",
        contentAr:
          "هو محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف، من قبيلة قريش سادة مكة وحُرّاس الكعبة المشرفة. ينتهي نسبه إلى إسماعيل بن إبراهيم عليهما السلام. اختاره الله من أطهر الأنساب وأشرف البيوت، فهو خير العرب نسباً ﷺ.\n\nتوفي والده عبد الله بن عبد المطلب قبل ولادته أثناء رحلة تجارة في المدينة (يثرب)، فولد ﷺ يتيماً. تولّت أمه آمنة بنت وهب من بني زُهرة حضانته الأولى بمساعدة جده عبد المطلب سيّد قريش.",
        contentEn:
          "He is Muhammad, son of Abdullah, son of Abdul-Muttalib, son of Hashim, son of Abd Manaf, of the tribe of Quraysh — the custodians of Makkah and guardians of the Ka'bah. His lineage traces back to Prophet Isma'il (Ishmael), son of Prophet Ibrahim (Abraham), peace be upon them both. God chose him from the purest of lineages and the noblest of households.\n\nHis father Abdullah ibn Abdul-Muttalib passed away before his birth during a trade journey in Madinah (then called Yathrib), so the Prophet ﷺ was born an orphan. His mother Aminah bint Wahb from Banu Zuhrah cared for him initially, with the help of his grandfather Abdul-Muttalib, the chief of Quraysh.",
      },
      {
        titleAr: "عام الفيل",
        titleEn: "The Year of the Elephant",
        icon: "AlertCircle",
        contentAr:
          "سُمّي العام الذي وُلد فيه النبي ﷺ بعام الفيل نسبةً إلى حادثة جيش أبرهة الأشرم — حاكم اليمن من الأحباش — الذي سار بجيش جرّار يتقدمه فيل ضخم يريد هدم الكعبة. غير أن الله حمى بيته، فأرسل عليهم طيراً أبابيل ترميهم بحجارة من سجّيل، فجعلهم كعصفٍ مأكول.\n\nحدثت هذه المعجزة قبل مولد النبي ﷺ بنحو خمسين يوماً، فكانت تمهيداً إلهياً وبشارةً بقدوم خاتم الأنبياء الذي سيعيد للكعبة قدسيتها التوحيدية.",
        contentEn:
          "The year the Prophet ﷺ was born was named the Year of the Elephant after the incident of Abraha al-Ashram — the Abyssinian ruler of Yemen — who marched a massive army led by a great elephant to demolish the Ka'bah. But God protected His House, sending flocks of birds (Ababil) that pelted them with stones of baked clay, destroying them completely.\n\nThis miracle occurred approximately fifty days before the Prophet's ﷺ birth. It served as a divine prelude and glad tiding for the coming of the Seal of the Prophets, who would restore the Ka'bah to its monotheistic sanctity.",
      },
      {
        titleAr: "الولادة المباركة",
        titleEn: "The Blessed Birth",
        icon: "Heart",
        contentAr:
          "وُلد ﷺ يوم الاثنين، الثاني عشر من ربيع الأول (على الراجح)، الموافق أبريل ٥٧٠ م، في شِعب بني هاشم بمكة المكرمة. أمه آمنة بنت وهب أخبرت أنها لم تجد ثقلاً في حملها مثل النساء، وأنها رأت نوراً خرج منها أضاء لها قصور بُصرى من أرض الشام.\n\nفرح جدّه عبد المطلب بالمولود فرحاً عظيماً، فحمله ودخل به الكعبة ودعا الله وشكره، وسماه «محمداً» — وهو اسم لم يكن شائعاً عند العرب — بمعنى «المحمود» أي كثير الحمد والثناء.",
        contentEn:
          "He ﷺ was born on a Monday, the 12th of Rabi' al-Awwal (according to the predominant opinion), corresponding to April 570 CE, in the quarter of Banu Hashim in Makkah. His mother Aminah reported that she felt no heaviness during pregnancy, and that she saw a light emanating from her that illuminated the palaces of Busra in Syria.\n\nHis grandfather Abdul-Muttalib was overjoyed. He carried the newborn into the Ka'bah, prayed to God and gave thanks, and named him 'Muhammad' — a name uncommon among the Arabs at the time — meaning 'the praised one,' the one who is frequently praised and commended.",
      },
      {
        titleAr: "الرضاعة في بادية بني سعد",
        titleEn: "Nursing in the Desert of Banu Sa'd",
        icon: "Send",
        contentAr:
          "جرت عادة العرب أن يرسلوا أبناءهم إلى البادية لينشؤوا على الفصاحة وقوة البدن وصفاء الطبع. جاءت حليمة بنت أبي ذؤيب السعدية إلى مكة تبحث عن رضيع، فلم يرغب أحد في أخذ محمد ﷺ لأنه يتيم لا مال لأبيه. لكن حليمة — وقد لم تجد غيره — أخذته.\n\nمنذ أن ضمّته حليمة، حلّت البركة عليها: درّ لبنها بعد شحّ، وسمنت أتانها الهزيلة، وأخصبت أغنامها. عاش ﷺ في بني سعد نحو أربع إلى خمس سنوات، تعلّم فيها العربية الفصحى وعُرف بحُسن الخلق حتى في طفولته.\n\nفي هذه الفترة وقعت حادثة «شق الصدر» حيث جاءه مَلَكان فشقّا صدره واستخرجا منه علقة سوداء وغسلا قلبه بماء زمزم — تطهيراً ربّانياً استعداداً لحمل الرسالة العظمى.",
        contentEn:
          "It was the custom of the Arabs to send their children to the desert to grow up learning eloquent speech, physical strength, and purity of character. Halimah bint Abi Dhu'ayb al-Sa'diyyah came to Makkah seeking a nursling, but no one wanted to take Muhammad ﷺ because he was an orphan with no father's wealth. Halimah — having found no other child — took him.\n\nFrom the moment she embraced him, blessings descended upon her: her milk flowed after drying up, her thin she-camel grew healthy, and her flocks became fertile. He ﷺ lived among Banu Sa'd for about four to five years, learning pure Arabic and becoming known for his excellent character even in childhood.\n\nDuring this period, the incident of the 'Splitting of the Chest' occurred: two angels came to him, opened his chest, removed a black clot, and washed his heart with Zamzam water — a divine purification preparing him to carry the great message.",
      },
      {
        titleAr: "علامات النبوة في الطفولة",
        titleEn: "Signs of Prophethood in Childhood",
        icon: "Star",
        contentAr:
          "ذكر المؤرخون عدة علامات ظهرت عند مولده وفي طفولته ﷺ:\n\n• رؤيا أمه آمنة بالنور الذي أضاء الشام\n• إيوان كسرى (قصر ملك الفرس) تصدّع ليلة مولده\n• خمدت نار المجوس التي لم تخمد منذ ألف عام\n• انهدم أربع عشرة شرفة من إيوان كسرى\n• غاضت بحيرة ساوة\n\nكل هذه العلامات كانت إرهاصات إلهية تُبشّر بتغيير جذري في تاريخ البشرية مع بعثة خاتم الرسل ﷺ.",
        contentEn:
          "Historians mentioned several signs that appeared at his birth and during his childhood ﷺ:\n\n• His mother Aminah's vision of a light that illuminated Syria\n• The palace of Kisra (Persian Emperor) cracked the night of his birth\n• The Zoroastrian fire that had burned for a thousand years was extinguished\n• Fourteen balconies of Kisra's palace collapsed\n• Lake Sawah dried up\n\nAll these signs were divine precursors heralding a fundamental change in human history with the mission of the Seal of the Messengers ﷺ.",
      },
    ],

    quranRefs: [
      {
        surah: "الفيل",
        surahEn: "Al-Fil (The Elephant)",
        ayah: "١-٥",
        textAr:
          "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ❁ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ❁ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ❁ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ❁ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
        textEn:
          "Have you not considered how your Lord dealt with the companions of the elephant? Did He not make their plan into misguidance? And He sent against them birds in flocks, striking them with stones of hard clay, and He made them like eaten straw.",
      },
      {
        surah: "الضحى",
        surahEn: "Ad-Duha (The Morning Hours)",
        ayah: "٦-٨",
        textAr:
          "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ ❁ وَوَجَدَكَ ضَالًّا فَهَدَىٰ ❁ وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ",
        textEn:
          "Did He not find you an orphan and give you refuge? And He found you lost and guided you. And He found you poor and made you self-sufficient.",
      },
      {
        surah: "الشرح",
        surahEn: "Ash-Sharh (The Opening Forth)",
        ayah: "١-٤",
        textAr:
          "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ❁ وَوَضَعْنَا عَنْكَ وِزْرَكَ ❁ الَّذِي أَنْقَضَ ظَهْرَكَ ❁ وَرَفَعْنَا لَكَ ذِكْرَكَ",
        textEn:
          "Did We not expand for you your breast? And We removed from you your burden, which had weighed upon your back, and raised high for you your repute.",
      },
    ],

    hadithRefs: [
      {
        sourceAr: "صحيح مسلم — كتاب الفضائل",
        sourceEn: "Sahih Muslim — Book of Virtues",
        textAr:
          "سُئل رسول الله ﷺ عن صوم يوم الاثنين، فقال: «ذاك يومٌ وُلدتُ فيه، ويومٌ بُعثتُ — أو أُنزل عليّ فيه».",
        textEn:
          "The Messenger of Allah ﷺ was asked about fasting on Mondays. He said: 'That is the day on which I was born, and the day on which I was sent — or revelation was sent down to me.'",
      },
      {
        sourceAr: "صحيح مسلم — حادثة شق الصدر",
        sourceEn: "Sahih Muslim — Incident of the Splitting of the Chest",
        textAr:
          "عن أنس بن مالك: أن رسول الله ﷺ أتاه جبريل وهو يلعب مع الغلمان، فأخذه فصرعه فشقّ عن قلبه فاستخرج القلب فاستخرج منه علقة فقال: هذا حظّ الشيطان منك، ثم غسله في طست من ذهب بماء زمزم ثم لأَمَه ثم أعاده في مكانه.",
        textEn:
          "Anas ibn Malik narrated: Jibreel came to the Messenger of Allah ﷺ while he was playing with the boys. He took him, laid him down, split open his chest, and took out the heart. He extracted a blood-clot from it and said: 'This is the share of Satan from you.' Then he washed it in a golden basin with Zamzam water, then closed it up and returned it to its place.",
      },
      {
        sourceAr: "مسند أحمد — فضل نسبه ﷺ",
        sourceEn: "Musnad Ahmad — Virtue of His Lineage ﷺ",
        textAr:
          "قال رسول الله ﷺ: «إنّ الله اصطفى كنانة من ولد إسماعيل، واصطفى قريشاً من كنانة، واصطفى من قريش بني هاشم، واصطفاني من بني هاشم».",
        textEn:
          "The Messenger of Allah ﷺ said: 'God chose Kinanah from the children of Isma'il, chose Quraysh from Kinanah, chose Banu Hashim from Quraysh, and chose me from Banu Hashim.'",
      },
    ],

    sources: [
      {
        titleAr: "الرحيق المختوم",
        titleEn: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
        authorAr: "صفي الرحمن المباركفوري",
        authorEn: "Safiur-Rahman Al-Mubarakpuri",
      },
      {
        titleAr: "سيرة ابن هشام",
        titleEn: "Ibn Hisham's Seerah",
        authorAr: "عبد الملك بن هشام",
        authorEn: "Abdul-Malik Ibn Hisham",
      },
      {
        titleAr: "صحيح البخاري",
        titleEn: "Sahih al-Bukhari",
        authorAr: "الإمام محمد بن إسماعيل البخاري",
        authorEn: "Imam Muhammad ibn Ismail al-Bukhari",
      },
      {
        titleAr: "صحيح مسلم",
        titleEn: "Sahih Muslim",
        authorAr: "الإمام مسلم بن الحجاج",
        authorEn: "Imam Muslim ibn al-Hajjaj",
      },
      {
        titleAr: "البداية والنهاية",
        titleEn: "Al-Bidayah wan-Nihayah",
        authorAr: "الإمام ابن كثير",
        authorEn: "Imam Ibn Kathir",
      },
      {
        titleAr: "زاد المعاد في هدي خير العباد",
        titleEn: "Zad al-Ma'ad",
        authorAr: "الإمام ابن القيم",
        authorEn: "Imam Ibn al-Qayyim",
      },
    ],

    relatedEventIds: ["halimah", "orphan", "trade"],
  },
};
