export interface Battle {
  id: string;
  nameAr: string;
  nameEn: string;
  hijriYear: number;
  gregorianYear: number;
  month?: string;
  locationAr: string;
  locationEn: string;
  outcomeAr: string;
  outcomeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  muslimForces?: number;
  enemyForces?: number;
  category: "ghazwah" | "sariyyah";
  result: "victory" | "defeat" | "draw" | "no-combat";
  significance: 1 | 2 | 3; // 1=major, 2=significant, 3=minor
}

export const battlesData: Battle[] = [
  {
    id: "badr",
    nameAr: "غزوة بدر الكبرى",
    nameEn: "Battle of Badr",
    hijriYear: 2,
    gregorianYear: 624,
    month: "Ramadan",
    locationAr: "بدر",
    locationEn: "Badr",
    outcomeAr: "انتصار ساحق للمسلمين",
    outcomeEn: "Decisive Muslim victory",
    descriptionAr:
      "أول معركة كبرى في الإسلام، حيث واجه 313 من المسلمين جيش قريش المكون من ألف مقاتل. نصر الله المؤمنين نصراً مبيناً رغم قلة عددهم وعدتهم، وأنزل الملائكة تقاتل معهم. استُشهد 14 من المسلمين وقُتل 70 من قريش وأُسر 70، وكان من بين القتلى صناديد قريش وأئمة الكفر.",
    descriptionEn:
      "The first major battle in Islam, where 313 Muslims faced the Quraish army of 1,000 fighters. Allah granted the believers a clear victory despite their small numbers and limited equipment, and sent down angels to fight alongside them. 14 Muslims were martyred while 70 Quraish were killed and 70 captured, including the leaders and champions of disbelief.",
    muslimForces: 313,
    enemyForces: 1000,
    category: "ghazwah",
    result: "victory",
    significance: 1,
  },
  {
    id: "uhud",
    nameAr: "غزوة أحد",
    nameEn: "Battle of Uhud",
    hijriYear: 3,
    gregorianYear: 625,
    month: "Shawwal",
    locationAr: "جبل أحد، المدينة المنورة",
    locationEn: "Mount Uhud, Madinah",
    outcomeAr: "هزيمة جزئية للمسلمين بسبب مخالفة الرماة",
    outcomeEn: "Partial defeat due to archers disobeying orders",
    descriptionAr:
      "خرجت قريش للثأر من هزيمتها في بدر بجيش قوامه 3000 مقاتل. بدأت المعركة بانتصار المسلمين، لكن عندما ترك الرماة مواقعهم على الجبل طمعاً في الغنائم، التف خالد بن الوليد (كان لا يزال مشركاً) من خلفهم وقلب مجرى المعركة. استُشهد 70 من المسلمين بينهم حمزة بن عبد المطلب رضي الله عنه، وكانت هذه ابتلاءً عظيماً ودرساً في طاعة الأوامر.",
    descriptionEn:
      "Quraish marched out to avenge their defeat at Badr with an army of 3,000 fighters. The battle began with Muslim victory, but when the archers left their positions on the mountain seeking booty, Khalid ibn Al-Walid (still a polytheist then) flanked them and turned the tide. 70 Muslims were martyred including Hamza ibn Abdul-Muttalib (RA). This was a great trial and lesson in obedience to commands.",
    muslimForces: 700,
    enemyForces: 3000,
    category: "ghazwah",
    result: "defeat",
    significance: 1,
  },
  {
    id: "khandaq",
    nameAr: "غزوة الخندق (الأحزاب)",
    nameEn: "Battle of the Trench (Al-Ahzab)",
    hijriYear: 5,
    gregorianYear: 627,
    month: "Shawwal",
    locationAr: "المدينة المنورة",
    locationEn: "Madinah",
    outcomeAr: "نصر استراتيجي بانسحاب الأحزاب",
    outcomeEn: "Strategic victory with coalition withdrawal",
    descriptionAr:
      "تحالفت قريش مع قبائل عديدة وحاصروا المدينة بجيش قوامه 10,000 مقاتل. بمشورة سلمان الفارسي رضي الله عنه، حفر المسلمون خندقاً حول المدينة — تكتيك لم تعرفه العرب من قبل. دام الحصار قرابة شهر في ظروف قاسية، ثم أرسل الله ريحاً عاتية وملائكة فزلزلت قلوب الأحزاب فانسحبوا. لم يحدث قتال مباشر كبير.",
    descriptionEn:
      "Quraish formed a coalition with numerous tribes and besieged Madinah with an army of 10,000 fighters. Upon Salman Al-Farsi's (RA) counsel, the Muslims dug a trench around the city — a tactic unknown to the Arabs. The siege lasted about a month under harsh conditions, then Allah sent a severe wind and angels that shook the coalition's hearts and they withdrew. No major direct combat occurred.",
    muslimForces: 3000,
    enemyForces: 10000,
    category: "ghazwah",
    result: "no-combat",
    significance: 1,
  },
  {
    id: "banu-qaynuqa",
    nameAr: "غزوة بني قينقاع",
    nameEn: "Expedition of Banu Qaynuqa",
    hijriYear: 2,
    gregorianYear: 624,
    month: "Shawwal",
    locationAr: "المدينة المنورة",
    locationEn: "Madinah",
    outcomeAr: "نصر المسلمين وإجلاء اليهود",
    outcomeEn: "Muslim victory and Jewish expulsion",
    descriptionAr:
      "بعد بدر، نقض بنو قينقاع (قبيلة يهودية في المدينة) عهدهم مع المسلمين وتآمروا عليهم. حاصرهم النبي ﷺ 15 ليلة حتى استسلموا. أراد النبي ﷺ تطبيق حكم الخيانة لكن عبد الله بن أُبي (زعيم المنافقين) شفع لهم، فأجلاهم النبي ﷺ من المدينة.",
    descriptionEn:
      "After Badr, Banu Qaynuqa (a Jewish tribe in Madinah) broke their treaty with the Muslims and conspired against them. The Prophet ﷺ besieged them for 15 nights until they surrendered. The Prophet ﷺ intended to apply the punishment for treason, but Abdullah ibn Ubayy (leader of the hypocrites) interceded for them, so the Prophet ﷺ expelled them from Madinah.",
    muslimForces: 700,
    category: "ghazwah",
    result: "victory",
    significance: 2,
  },
  {
    id: "banu-nadir",
    nameAr: "غزوة بني النضير",
    nameEn: "Expedition of Banu Nadir",
    hijriYear: 4,
    gregorianYear: 625,
    month: "Rabi al-Awwal",
    locationAr: "المدينة المنورة",
    locationEn: "Madinah",
    outcomeAr: "نصر المسلمين وإجلاء اليهود",
    outcomeEn: "Muslim victory and Jewish expulsion",
    descriptionAr:
      "حاولت بنو النضير اغتيال النبي ﷺ بإلقاء صخرة عليه، فأوحى الله إليه بمؤامرتهم. حاصرهم المسلمون في حصونهم، وبعد 15 يوماً استسلموا. أجلاهم النبي ﷺ من المدينة، فهاجر أكثرهم إلى خيبر وبعضهم إلى الشام. نزلت سورة الحشر كاملة في هذه الغزوة.",
    descriptionEn:
      "Banu Nadir attempted to assassinate the Prophet ﷺ by dropping a boulder on him, but Allah revealed their plot. The Muslims besieged them in their fortresses, and after 15 days they surrendered. The Prophet ﷺ expelled them from Madinah; most migrated to Khaybar and some to Syria. The entire Surah Al-Hashr was revealed about this expedition.",
    muslimForces: 1500,
    category: "ghazwah",
    result: "victory",
    significance: 2,
  },
  {
    id: "banu-qurayza",
    nameAr: "غزوة بني قريظة",
    nameEn: "Expedition of Banu Qurayza",
    hijriYear: 5,
    gregorianYear: 627,
    month: "Dhul Qadah",
    locationAr: "المدينة المنورة",
    locationEn: "Madinah",
    outcomeAr: "نصر المسلمين وتطبيق حكم الخيانة",
    outcomeEn: "Muslim victory and treason judgment executed",
    descriptionAr:
      "مباشرة بعد غزوة الخندق، خان بنو قريظة العهد وانضموا للأحزاب ضد المسلمين في أحلك اللحظات. حاصرهم النبي ﷺ 25 يوماً حتى استسلموا. طلبوا أن يحكم فيهم سعد بن معاذ رضي الله عنه (حليفهم القديم)، فحكم بحكم التوراة نفسها: قتل المقاتلين وسبي النساء والذرية — وأقره النبي ﷺ أنه حكم الله من فوق سبع سماوات.",
    descriptionEn:
      "Immediately after the Battle of the Trench, Banu Qurayza betrayed their treaty and joined the coalition against Muslims at the darkest hour. The Prophet ﷺ besieged them for 25 days until they surrendered. They requested Sa'd ibn Mu'adh (RA) (their old ally) to judge them. He ruled according to the Torah itself: execution of fighters and enslavement of women and children — the Prophet ﷺ affirmed it was Allah's judgment from above seven heavens.",
    muslimForces: 3000,
    category: "ghazwah",
    result: "victory",
    significance: 2,
  },
  {
    id: "banu-mustaliq",
    nameAr: "غزوة بني المصطلق (المريسيع)",
    nameEn: "Expedition of Banu Mustaliq (Al-Muraisi)",
    hijriYear: 6,
    gregorianYear: 627,
    month: "Shaban",
    locationAr: "المريسيع (قرب مكة)",
    locationEn: "Al-Muraisi (near Makkah)",
    outcomeAr: "نصر المسلمين",
    outcomeEn: "Muslim victory",
    descriptionAr:
      "بلغ النبي ﷺ أن بني المصطلق يجمعون الجموع لغزو المدينة، فباغتهم بجيش قبل أن يكتمل استعدادهم. انتصر المسلمون وأخذوا سبايا كثيرة، من بينهن جويرية بنت الحارث (سيدة قومها) التي تزوجها النبي ﷺ فأعتق المسلمون 100 أسير من قومها إكراماً لأصهار رسول الله. وفي طريق العودة وقعت حادثة الإفك التي برّأ الله فيها السيدة عائشة رضي الله عنها.",
    descriptionEn:
      "The Prophet ﷺ learned that Banu Mustaliq were gathering forces to attack Madinah, so he surprised them before they completed their preparations. The Muslims won and took many captives, including Juwayriyah bint Al-Harith (a noble lady). The Prophet ﷺ married her, and Muslims freed 100 of her people in honor of being the Prophet's in-laws. On the return journey, the false accusation (Ifk) incident occurred, in which Allah exonerated Lady Aisha (RA).",
    muslimForces: 700,
    category: "ghazwah",
    result: "victory",
    significance: 2,
  },
  {
    id: "khaybar",
    nameAr: "غزوة خيبر",
    nameEn: "Battle of Khaybar",
    hijriYear: 7,
    gregorianYear: 628,
    month: "Muharram",
    locationAr: "خيبر (شمال المدينة)",
    locationEn: "Khaybar (north of Madinah)",
    outcomeAr: "نصر حاسم للمسلمين",
    outcomeEn: "Decisive Muslim victory",
    descriptionAr:
      "كانت خيبر معقل اليهود الحصين شمال المدينة، ومركز التآمر على المسلمين. حاصرها المسلمون وفتحوا حصونها واحداً تلو الآخر رغم منعتها. برز علي بن أبي طالب رضي الله عنه في بطولات خارقة، منها قلع باب الحصن الضخم. وفي خيبر حاولت امرأة يهودية أن تسمّ النبي ﷺ بشاة مسمومة، لكن الله حماه. بعد الفتح عاهد اليهود المسلمين وبقوا في أرضهم يزرعونها بنصف المحصول.",
    descriptionEn:
      "Khaybar was the fortified stronghold of the Jews north of Madinah and the center of conspiracy against Muslims. Muslims besieged it and conquered its fortresses one by one despite their strength. Ali ibn Abi Talib (RA) displayed extraordinary heroism, including uprooting the massive fortress gate. At Khaybar, a Jewish woman attempted to poison the Prophet ﷺ with poisoned sheep, but Allah protected him. After the conquest, the Jews made a treaty with Muslims and remained on their land farming it for half the harvest.",
    muslimForces: 1600,
    enemyForces: 10000,
    category: "ghazwah",
    result: "victory",
    significance: 1,
  },
  {
    id: "mutah",
    nameAr: "غزوة مؤتة",
    nameEn: "Battle of Mutah",
    hijriYear: 8,
    gregorianYear: 629,
    month: "Jumada al-Awwal",
    locationAr: "مؤتة (الأردن اليوم)",
    locationEn: "Mutah (modern-day Jordan)",
    outcomeAr: "انسحاب استراتيجي بعد استشهاد القادة",
    outcomeEn: "Strategic withdrawal after commanders martyred",
    descriptionAr:
      'أول معركة مع الروم، أرسل النبي ﷺ 3000 مقاتل لكنهم واجهوا 200,000 من جيش الروم وحلفائهم! استُشهد القادة الثلاثة الذين عيّنهم النبي ﷺ بالترتيب: زيد بن حارثة، ثم جعفر بن أبي طالب، ثم عبد الله بن رواحة رضي الله عنهم. أخذ الراية خالد بن الوليد وانسحب بالجيش بتكتيك عبقري حتى أثنى عليه النبي ﷺ ولقّبه "سيف الله المسلول". رغم عدم تحقيق النصر العسكري، كان النجاة بالجيش نصراً معنوياً عظيماً.',
    descriptionEn:
      "The first battle against the Romans. The Prophet ﷺ sent 3,000 fighters but they faced 200,000 from the Roman army and their allies! The three commanders appointed by the Prophet ﷺ were martyred in sequence: Zayd ibn Harithah, then Ja'far ibn Abi Talib, then Abdullah ibn Rawahah (RA). Khalid ibn Al-Walid took the banner and withdrew the army with brilliant tactics, earning the Prophet's ﷺ praise and the title \"Sword of Allah Unsheathed.\" Despite not achieving military victory, saving the army was a tremendous moral victory.",
    muslimForces: 3000,
    enemyForces: 200000,
    category: "sariyyah",
    result: "draw",
    significance: 1,
  },
  {
    id: "fath-makkah",
    nameAr: "فتح مكة",
    nameEn: "Conquest of Makkah",
    hijriYear: 8,
    gregorianYear: 630,
    month: "Ramadan",
    locationAr: "مكة المكرمة",
    locationEn: "Makkah",
    outcomeAr: "فتح سلمي بدون قتال يُذكر",
    outcomeEn: "Peaceful conquest with minimal fighting",
    descriptionAr:
      'نقضت قريش صلح الحديبية، فسار النبي ﷺ بجيش قوامه 10,000 مقاتل لفتح مكة. دخلها في تواضع جم، رأسه منحنٍ شكراً لله. عفا عن أهل مكة جميعاً قائلاً: "اذهبوا فأنتم الطلقاء"، رغم 13 عاماً من التعذيب والاضطهاد. كانت لحظة العفو هذه من أعظم مشاهد الرحمة في التاريخ. طهّر الكعبة من الأصنام وأعلن التوحيد. لم يحدث قتال إلا مناوشات بسيطة جداً، ودخل الناس في دين الله أفواجاً.',
    descriptionEn:
      "Quraish broke the Treaty of Hudaybiyyah, so the Prophet ﷺ marched with an army of 10,000 to conquer Makkah. He entered with utmost humility, his head bowed in gratitude to Allah. He pardoned all the people of Makkah saying: \"Go, you are free,\" despite 13 years of torture and persecution. This moment of pardon was one of history's greatest displays of mercy. He purified the Ka'bah from idols and proclaimed Tawheed. There was virtually no fighting except minor skirmishes, and people entered Allah's religion in crowds.",
    muslimForces: 10000,
    category: "ghazwah",
    result: "no-combat",
    significance: 1,
  },
  {
    id: "hunayn",
    nameAr: "غزوة حنين",
    nameEn: "Battle of Hunayn",
    hijriYear: 8,
    gregorianYear: 630,
    month: "Shawwal",
    locationAr: "حنين (بين مكة والطائف)",
    locationEn: "Hunayn (between Makkah and Taif)",
    outcomeAr: "نصر بعد بداية صعبة",
    outcomeEn: "Victory after difficult start",
    descriptionAr:
      'بعد فتح مكة مباشرة، تجمّعت قبيلتا هوازن وثقيف بجيش كبير. خرج المسلمون بـ 12,000 مقاتل وأُعجب بعضهم بكثرتهم. كمن العدو للمسلمين في وادٍ ضيق فهاجموهم بسهام كثيفة ففرّ أكثر المسلمين. ثبت النبي ﷺ مع قلّة من أصحابه ونادى: "أنا النبي لا كذب، أنا ابن عبد المطلب"، ونادى العباس بن عبد المطلب الناس بصوته الجهوري فعادوا. ثم هزم الله العدو وانتصر المسلمون. نزل فيها قوله تعالى: "وَيَوْمَ حُنَيْنٍ ۙ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا".',
    descriptionEn:
      'Immediately after conquering Makkah, the tribes of Hawazin and Thaqif gathered a large army. The Muslims marched out with 12,000 fighters and some were impressed by their numbers. The enemy ambushed the Muslims in a narrow valley, attacking with dense arrows, and most Muslims fled. The Prophet ﷺ stood firm with a few companions and called: "I am the Prophet, no lie; I am the son of Abdul-Muttalib." Al-Abbas ibn Abdul-Muttalib called people back with his loud voice and they returned. Then Allah defeated the enemy and Muslims won. Allah revealed: "And on the day of Hunayn when your great number pleased you, but it did not avail you at all."',
    muslimForces: 12000,
    enemyForces: 20000,
    category: "ghazwah",
    result: "victory",
    significance: 1,
  },
  {
    id: "taif",
    nameAr: "حصار الطائف",
    nameEn: "Siege of Taif",
    hijriYear: 8,
    gregorianYear: 630,
    month: "Shawwal",
    locationAr: "الطائف",
    locationEn: "Taif",
    outcomeAr: "رفع الحصار ثم أسلموا لاحقاً",
    outcomeEn: "Siege lifted, then later accepted Islam",
    descriptionAr:
      'بعد حنين، حاصر النبي ﷺ الطائف (معقل ثقيف) نحو 40 يوماً. رمى أهل الطائف المسلمين بسهام محماة من حصونهم المنيعة. استخدم المسلمون المنجنيق لأول مرة في الإسلام، لكن الحصن بقي صامداً. استشار النبي ﷺ أصحابه فأشاروا بالانسحاب، فرفع الحصار قائلاً: "اللهم اهدِ ثقيفاً وائت بهم". وبالفعل، بعد أشهر جاءت ثقيف مسلمة طائعة.',
    descriptionEn:
      'After Hunayn, the Prophet ﷺ besieged Taif (Thaqif\'s stronghold) for about 40 days. The people of Taif shot heated arrows at Muslims from their impregnable fortresses. Muslims used catapults for the first time in Islam, but the fortress held. The Prophet ﷺ consulted his companions who advised withdrawal, so he lifted the siege saying: "O Allah, guide Thaqif and bring them to us." Indeed, months later, Thaqif came peacefully as Muslims.',
    muslimForces: 12000,
    category: "ghazwah",
    result: "no-combat",
    significance: 2,
  },
  {
    id: "tabuk",
    nameAr: "غزوة تبوك",
    nameEn: "Expedition of Tabuk",
    hijriYear: 9,
    gregorianYear: 630,
    month: "Rajab",
    locationAr: "تبوك (شمال الجزيرة)",
    locationEn: "Tabuk (northern Arabia)",
    outcomeAr: "إظهار قوة بدون قتال",
    outcomeEn: "Show of strength without combat",
    descriptionAr:
      "آخر غزوات النبي ﷺ، خرج بـ 30,000 مقاتل في حرّ شديد وعسرة مالية (سُميت غزوة العسرة) لمواجهة تهديد روماني محتمل. قطع المسلمون مسافة 1000 كم في ظروف قاسية. لم يأتِ الروم، لكن الحملة حققت أهدافاً استراتيجية: إظهار قوة المسلمين، تأمين الحدود الشمالية، وعقد معاهدات مع القبائل. في هذه الغزوة تخلّف المنافقون وبعض المؤمنين (الثلاثة الذين تاب الله عليهم)، ونزلت سورة التوبة كاملة فيها.",
    descriptionEn:
      "The Prophet's ﷺ last expedition, marching with 30,000 fighters in severe heat and financial hardship (called \"Expedition of Hardship\") to face a potential Roman threat. Muslims traveled 1,000 km under harsh conditions. The Romans didn't come, but the campaign achieved strategic goals: demonstrating Muslim power, securing the northern borders, and making treaties with tribes. In this expedition, the hypocrites and some believers (the three whom Allah forgave) stayed behind, and the entire Surah At-Tawbah was revealed about it.",
    muslimForces: 30000,
    category: "ghazwah",
    result: "no-combat",
    significance: 1,
  },
];

// Utility functions for filtering/sorting battles
export const getBattlesByResult = (result: Battle["result"]) =>
  battlesData.filter((b) => b.result === result);

export const getBattlesBySignificance = (
  significance: Battle["significance"],
) => battlesData.filter((b) => b.significance === significance);

export const getBattlesByCategory = (category: Battle["category"]) =>
  battlesData.filter((b) => b.category === category);

export const getMajorBattles = () => getBattlesBySignificance(1);

export const getVictories = () => getBattlesByResult("victory");

export const getGhazwat = () => getBattlesByCategory("ghazwah");

export const getSaraya = () => getBattlesByCategory("sariyyah");
