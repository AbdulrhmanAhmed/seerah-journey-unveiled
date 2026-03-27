import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type QuizOption = { text: string; text_en: string; is_correct: boolean };

type QuizQuestion = {
  id: string;
  era: string;
  question: string;
  question_en: string;
  options: QuizOption[];
  explanation: string;
  explanation_en: string;
  difficulty: string;
  related_event_id: string | null;
};

const eras = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "makkah", ar: "المكية", en: "Makkah" },
  { key: "madinah", ar: "المدنية", en: "Madinah" },
];

const difficulties = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "easy", ar: "سهل", en: "Easy" },
  { key: "medium", ar: "متوسط", en: "Medium" },
  { key: "hard", ar: "صعب", en: "Hard" },
];

const QuizPage = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [selectedEra, setSelectedEra] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ["quiz_questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return (data || []).map((q: any) => ({
        ...q,
        options: (typeof q.options === "string" ? JSON.parse(q.options) : q.options) as QuizOption[],
      })) as QuizQuestion[];
    },
  });

  const questions = useMemo(() => {
    return allQuestions.filter((q) => {
      const eraMatch = selectedEra === "all" || q.era === selectedEra;
      const diffMatch = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
      return eraMatch && diffMatch;
    });
  }, [allQuestions, selectedEra, selectedDifficulty]);

  const current = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100 : 0;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (current.options[index]?.is_correct) {
      setScore((s) => s + 1);
    }
    setAnsweredQuestions((prev) => new Set(prev).add(currentIndex));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      // Save score if user is logged in
      saveScore();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  const saveScore = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("quiz_scores").insert({
        user_id: user.id,
        era: selectedEra,
        score,
        total_questions: questions.length,
      });
    }
  };

  const restart = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setAnsweredQuestions(new Set());
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setAnsweredQuestions(new Set());
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Brain size={16} />
            <span>{isAr ? "اختبار المعرفة" : "Knowledge Quiz"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-amiri mb-3">
            {isAr ? "اختبر معرفتك بالسيرة" : "Test Your Seerah Knowledge"}
          </h1>
          <p className="text-muted-foreground">
            {isAr
              ? "أجب على الأسئلة واختبر فهمك لأحداث السيرة النبوية"
              : "Answer questions and test your understanding of the Prophetic biography"}
          </p>
        </div>

        {!quizStarted && !finished ? (
          /* Setup Screen */
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{isAr ? "الفترة" : "Era"}</h3>
              <div className="flex gap-2">
                {eras.map((era) => (
                  <button
                    key={era.key}
                    onClick={() => setSelectedEra(era.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedEra === era.key
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary/20"
                    }`}
                  >
                    {isAr ? era.ar : era.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{isAr ? "المستوى" : "Difficulty"}</h3>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDifficulty(d.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === d.key
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary/20"
                    }`}
                  >
                    {isAr ? d.ar : d.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {isAr ? `${questions.length} سؤال متاح` : `${questions.length} questions available`}
              </p>
              <Button
                onClick={startQuiz}
                disabled={questions.length === 0 || isLoading}
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isAr ? "ابدأ الاختبار" : "Start Quiz"}
              </Button>
            </div>
          </div>
        ) : finished ? (
          /* Results Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <Trophy className="mx-auto text-secondary" size={64} />
            <h2 className="text-2xl font-bold font-amiri text-foreground">
              {isAr ? "أحسنت!" : "Well Done!"}
            </h2>
            <div className="text-5xl font-bold text-secondary">{percentage}%</div>
            <p className="text-muted-foreground">
              {isAr
                ? `أجبت على ${score} من ${questions.length} بشكل صحيح`
                : `You answered ${score} out of ${questions.length} correctly`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={restart} variant="outline" className="gap-2">
                <RotateCcw size={16} />
                {isAr ? "إعادة" : "Retry"}
              </Button>
              <Button asChild className="bg-secondary text-secondary-foreground">
                <Link to="/journey">{isAr ? "استكشف الرحلة" : "Explore Journey"}</Link>
              </Button>
            </div>
          </motion.div>
        ) : current ? (
          /* Question Screen */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isAr ? "السؤال" : "Question"} {currentIndex + 1} / {questions.length}
              </span>
              <span>
                {isAr ? "النتيجة" : "Score"}: {score}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold text-foreground leading-relaxed">
                  {isAr ? current.question : current.question_en}
                </h2>

                <div className="space-y-2">
                  {current.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = option.is_correct;
                    const answered = selectedAnswer !== null;

                    let cls = "border-border hover:border-secondary/50";
                    if (answered && isCorrect) cls = "border-green-500 bg-green-50";
                    else if (answered && isSelected && !isCorrect) cls = "border-red-400 bg-red-50";

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className={`w-full text-start p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${cls}`}
                      >
                        <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm">{isAr ? option.text : option.text_en}</span>
                        {answered && isCorrect && <CheckCircle2 className="ms-auto text-green-600 shrink-0" size={20} />}
                        {answered && isSelected && !isCorrect && <XCircle className="ms-auto text-red-500 shrink-0" size={20} />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-muted border border-border"
                  >
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {isAr ? current.explanation : current.explanation_en}
                    </p>
                  </motion.div>
                )}

                {selectedAnswer !== null && (
                  <div className="flex justify-end">
                    <Button onClick={handleNext} className="bg-secondary text-secondary-foreground">
                      {currentIndex + 1 >= questions.length
                        ? isAr ? "عرض النتائج" : "Show Results"
                        : isAr ? "التالي" : "Next"}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuizPage;
