
-- Create shamail_traits table
CREATE TABLE public.shamail_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL,
  category text NOT NULL DEFAULT 'Moral',
  description text DEFAULT '',
  description_en text DEFAULT '',
  hadith_source text DEFAULT '',
  hadith_source_en text DEFAULT '',
  story_example text DEFAULT '',
  story_example_en text DEFAULT '',
  reflection text DEFAULT '',
  reflection_en text DEFAULT '',
  icon_name text DEFAULT 'heart',
  image_url text,
  map_location_id text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shamail_traits ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read active shamail traits"
ON public.shamail_traits FOR SELECT
USING (true);

-- Admin write
CREATE POLICY "Admins can manage shamail traits"
ON public.shamail_traits FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert initial 5 traits
INSERT INTO public.shamail_traits (title, title_en, category, description, description_en, hadith_source, hadith_source_en, story_example, story_example_en, reflection, reflection_en, icon_name) VALUES
('الرحمة', 'Mercy', 'Moral', 'كان النبي ﷺ أرحم الناس بالناس، يرحم الصغير ويوقر الكبير.', 'The Prophet ﷺ was the most merciful of people, showing compassion to the young and respect to the old.', 'قال رسول الله ﷺ: "الراحمون يرحمهم الرحمن، ارحموا من في الأرض يرحمكم من في السماء"', 'The Prophet ﷺ said: "The merciful are shown mercy by the Most Merciful. Show mercy to those on earth, and the One above the heavens will show mercy to you."', 'عفوه عن أهل مكة يوم الفتح رغم مقدرته عليهم، فقال: اذهبوا فأنتم الطلقاء.', 'His pardon of the people of Makkah on the day of conquest despite his power over them, saying: "Go, for you are free."', 'كيف أتمثل بهذه الصفة اليوم؟ هل أظهرت الرحمة لمن حولي؟', 'How can I embody this trait today? Have I shown mercy to those around me?', 'heart'),
('التواضع', 'Humility', 'Moral', 'كان ﷺ يجلس بين أصحابه كأحدهم، لا يتميز عليهم.', 'He ﷺ would sit among his companions as one of them, not distinguishing himself.', 'قال ﷺ: "لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر"', 'The Prophet ﷺ said: "No one who has an atom''s weight of arrogance in his heart will enter Paradise."', 'جلوسه بين أصحابه كأحدهم، حتى كان الغريب لا يعرفه بينهم فيسأل: أيكم محمد؟', 'He would sit among his companions so humbly that a stranger could not tell him apart and would ask: "Which of you is Muhammad?"', 'هل تواضعت في تعاملاتي اليوم مع الآخرين؟', 'Have I been humble in my dealings with others today?', 'hand-heart'),
('الجمال', 'Beauty', 'Physical', 'كان ﷺ أحسن الناس وجهاً وأنورهم لوناً.', 'He ﷺ was the most beautiful of people in face and the most radiant in complexion.', 'قال أنس رضي الله عنه: "ما مسست حريراً ولا ديباجاً ألين من كف رسول الله ﷺ"', 'Anas (may Allah be pleased with him) said: "I never touched silk or brocade softer than the palm of the Messenger of Allah ﷺ."', 'وصف الصحابة له: كان كأن الشمس تجري في وجهه، يتلألأ وجهه كالقمر ليلة البدر.', 'The companions described him: It was as if the sun ran across his face; his face shone like the full moon.', 'كيف أعتني بمظهري وأجعل جمالي الداخلي ينعكس على الخارج؟', 'How can I take care of my appearance and let my inner beauty reflect outward?', 'sparkles'),
('الوفاء', 'Loyalty', 'Social', 'كان ﷺ أوفى الناس عهداً، يحفظ العهد ويكرم الصديق.', 'He ﷺ was the most loyal of people, keeping promises and honoring friends.', 'قالت عائشة رضي الله عنها: "ما غرت على امرأة ما غرت على خديجة من كثرة ذكر رسول الله ﷺ إياها"', 'Aisha (may Allah be pleased with her) said: "I was never as jealous of any woman as I was of Khadijah, because of how much the Prophet ﷺ mentioned her."', 'وفاؤه للسيدة خديجة رضي الله عنها وصديقاتها حتى بعد وفاتها بسنوات، يذبح الشاة ويرسل لهن.', 'His loyalty to Lady Khadijah and her friends even years after her passing — he would slaughter a sheep and send portions to them.', 'هل حافظت على صلتي بأحبائي وأوفيت بعهودي؟', 'Have I maintained my bonds with loved ones and kept my promises?', 'users'),
('الشجاعة', 'Courage', 'Moral', 'كان ﷺ أشجع الناس، يثبت حيث يفر الشجعان.', 'He ﷺ was the bravest of people, standing firm where the brave would flee.', 'قال علي رضي الله عنه: "كنا إذا حمي الوطيس واحمرت الحدق نتقي برسول الله ﷺ"', 'Ali (may Allah be pleased with him) said: "When the battle intensified and eyes turned red, we would seek shelter behind the Messenger of Allah ﷺ."', 'قوله ﷺ يوم حنين "أنا النبي لا كذب، أنا ابن عبدالمطلب" وثباته حين تراجع الناس.', 'His words on the day of Hunayn: "I am the Prophet, no lie; I am the son of Abdul-Muttalib" — standing firm when the people retreated.', 'هل واجهت تحدياتي بشجاعة اليوم أم تراجعت؟', 'Did I face my challenges with courage today or did I retreat?', 'shield');
