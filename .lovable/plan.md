

## خطة: قسم الشمائل المحمدية (Shamail Traits)

### المرحلة 1: قاعدة البيانات
إنشاء جدول `shamail_traits` بالحقول التالية:
- `id` (uuid, PK)
- `title` / `title_en` (text) — اسم الصفة بالعربية والإنجليزية
- `category` (text — Physical, Moral, Social)
- `description` / `description_en` (text)
- `hadith_source` / `hadith_source_en` (text)
- `story_example` / `story_example_en` (text)
- `reflection` / `reflection_en` (text) — سؤال التأمل
- `icon_name` (text — اسم أيقونة Lucide)
- `image_url` (text)
- `map_location_id` (text, nullable — ربط بالخريطة)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

RLS: قراءة عامة، كتابة للأدمن فقط (نفس نمط الجداول الحالية).

إدخال 5 صفات أولية (الرحمة، التواضع، الجمال، الوفاء، الشجاعة).

### المرحلة 2: صفحة الشمائل العامة (`/character`)
إعادة بناء `CharacterPage.tsx` بالكامل:

- **العنوان**: "الشمائل المحمدية" بخط ذهبي + عنوان فرعي "استكشف صفات سيد الخلق ﷺ"
- **صفة اليوم**: بطاقة مميزة أعلى الصفحة تعرض صفة عشوائية تتغير كل 24 ساعة (بناءً على `Date.now()` mod عدد الصفات)
- **فلتر الفئات**: 3 أزرار: الصفات الخُلقية، الصفات الخَلقية، التعاملات الاجتماعية
- **شبكة البطاقات**: تصميم Glassmorphism بإطار أخضر زمردي، أيقونة Lucide ديناميكية، تأثير توهج ذهبي عند التمرير، ظهور متتابع (staggered animation) باستخدام Framer Motion
- **النافذة التفصيلية (Dialog)**: عند النقر تُفتح نافذة ملء الشاشة تحتوي:
  - اسم الصفة بخط كبير
  - قسم "من هدي النبي ﷺ" — القصة
  - قسم "قالوا عنه" — الحديث أو القول
  - صندوق تأمل "كيف أتمثل بهذه الصفة اليوم؟"
  - رابط للخريطة إن وُجد `map_location_id`

### المرحلة 3: إدارة الشمائل في لوحة التحكم
إنشاء `AdminShamailPage.tsx` على مسار `/admin/shamail`:
- جدول بجميع الصفات مع تعديل/حذف/تفعيل
- نموذج إضافة/تعديل بجميع الحقول (AR/EN)
- اختيار `map_location_id` من القائمة المنسدلة (جلب من `map_locations`)
- إضافة رابط في `AdminLayout` والـ Dashboard

### المرحلة 4: الترجمات
إضافة مفاتيح الترجمة اللازمة في `translations.ts` (shamailTitle, shamailSubtitle, traitOfDay, categoryMoral, categoryPhysical, categorySocial, etc.)

### ملاحظة تقنية
- ميزة "تحميل البطاقة كصورة" تحتاج مكتبة إضافية (html-to-canvas) — يمكن إضافتها لاحقاً كمرحلة منفصلة
- البيانات تُجلب عبر TanStack Query من قاعدة البيانات مباشرة

