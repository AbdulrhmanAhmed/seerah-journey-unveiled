import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Shuffle } from "lucide-react";

type QuizOption = { text: string; text_en: string; is_correct: boolean };

type QuizQuestion = {
  id: string;
  question: string;
  question_en: string;
  era: string;
  difficulty: string;
  display_order: number;
  is_active: boolean;
  explanation: string | null;
  explanation_en: string | null;
  options: QuizOption[];
  created_at: string;
};

const emptyForm = {
  question: "",
  question_en: "",
  era: "makkah",
  difficulty: "easy",
  display_order: 0,
  is_active: true,
  explanation: "",
  explanation_en: "",
};

const defaultOptions: QuizOption[] = [
  { text: "", text_en: "", is_correct: true },
  { text: "", text_en: "", is_correct: false },
];

export default function AdminQuizPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState<QuizOption[]>(defaultOptions);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["admin-quiz-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data || []).map((q: any) => ({
        ...q,
        options: (typeof q.options === "string"
          ? JSON.parse(q.options)
          : q.options) as QuizOption[],
      })) as QuizQuestion[];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = { ...form, options: options };
      if (editing) {
        const { error } = await supabase
          .from("quiz_questions")
          .update(payload)
          .eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("quiz_questions")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success(editing ? "Question updated" : "Question added");
      closeForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
      toast.success("Question deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("quiz_questions")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOptions([...defaultOptions]);
    setOpen(true);
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q.id);
    setForm({
      question: q.question,
      question_en: q.question_en,
      era: q.era,
      difficulty: q.difficulty,
      display_order: q.display_order,
      is_active: q.is_active,
      explanation: q.explanation ?? "",
      explanation_en: q.explanation_en ?? "",
    });
    setOptions(q.options.length > 0 ? q.options : [...defaultOptions]);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setOptions([...defaultOptions]);
  };

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const setOptionField = (
    index: number,
    field: keyof QuizOption,
    value: string | boolean
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) => {
        if (field === "is_correct") {
          return { ...opt, is_correct: i === index };
        }
        return i === index ? { ...opt, [field]: value } : opt;
      })
    );
  };

  const addOption = () => {
    if (options.length >= 4) return;
    setOptions((prev) => [...prev, { text: "", text_en: "", is_correct: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // If the removed option was correct, mark the first as correct
      if (prev[index].is_correct) {
        next[0] = { ...next[0], is_correct: true };
      }
      return next;
    });
  };

  const moveOption = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= options.length) return;
    setOptions((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const shuffleOptions = () => {
    setOptions((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  const eraLabel = (era: string) =>
    era === "makkah" ? "Makkah" : era === "madinah" ? "Madinah" : era;

  const diffLabel = (d: string) =>
    d === "easy" ? "Easy" : d === "medium" ? "Medium" : d === "hard" ? "Hard" : d;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Questions</h1>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Question (Arabic)</TableHead>
                <TableHead>Era</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="w-16">{q.display_order}</TableCell>
                  <TableCell className="max-w-xs truncate font-arabic" dir="rtl">
                    {q.question}
                  </TableCell>
                  <TableCell>{eraLabel(q.era)}</TableCell>
                  <TableCell>{diffLabel(q.difficulty)}</TableCell>
                  <TableCell>{q.options.length}</TableCell>
                  <TableCell>
                    <Switch
                      checked={q.is_active}
                      onCheckedChange={(checked) =>
                        toggleActive.mutate({ id: q.id, is_active: checked })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(q)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMut.mutate(q.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {questions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No questions yet. Add your first question.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Question" : "Add Question"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Question text */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Question (Arabic)</Label>
                <Textarea
                  dir="rtl"
                  value={form.question}
                  onChange={(e) => set("question", e.target.value)}
                  placeholder="اكتب السؤال بالعربية"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label>Question (English)</Label>
                <Textarea
                  value={form.question_en}
                  onChange={(e) => set("question_en", e.target.value)}
                  placeholder="Write the question in English"
                  rows={3}
                />
              </div>
            </div>

            {/* Era / Difficulty / Order */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Era</Label>
                <Select value={form.era} onValueChange={(v) => set("era", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makkah">Makkah</SelectItem>
                    <SelectItem value="madinah">Madinah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => set("difficulty", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(v) => set("is_active", v)}
              />
              <Label htmlFor="is_active">Active (visible in quiz)</Label>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Answer Options</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={shuffleOptions}
                    className="gap-1"
                    title="Shuffle option order"
                  >
                    <Shuffle className="h-3 w-3" />
                    Shuffle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={options.length >= 4}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Select the radio button next to the correct answer.
              </p>

              {options.map((opt, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-start p-3 rounded-lg border ${
                    opt.is_correct ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-border"
                  }`}
                >
                  {/* Correct answer radio */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={opt.is_correct}
                      onChange={() => setOptionField(i, "is_correct", true)}
                      className="accent-green-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] text-muted-foreground">Correct</span>
                  </div>

                  {/* Option texts */}
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      dir="rtl"
                      value={opt.text}
                      onChange={(e) => setOptionField(i, "text", e.target.value)}
                      placeholder={`الخيار ${i + 1}`}
                    />
                    <Input
                      value={opt.text_en}
                      onChange={(e) => setOptionField(i, "text_en", e.target.value)}
                      placeholder={`Option ${i + 1}`}
                    />
                  </div>

                  {/* Reorder + Remove buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveOption(i, "up")}
                      disabled={i === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveOption(i, "down")}
                      disabled={i === options.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 2}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Explanation (Arabic) — optional</Label>
                <Textarea
                  dir="rtl"
                  value={form.explanation}
                  onChange={(e) => set("explanation", e.target.value)}
                  placeholder="تفسير الإجابة الصحيحة"
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label>Explanation (English) — optional</Label>
                <Textarea
                  value={form.explanation_en}
                  onChange={(e) => set("explanation_en", e.target.value)}
                  placeholder="Explanation for the correct answer"
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                onClick={() => upsert.mutate()}
                disabled={
                  upsert.isPending ||
                  !form.question.trim() ||
                  !form.question_en.trim() ||
                  options.some((o) => !o.text.trim() || !o.text_en.trim())
                }
              >
                {upsert.isPending ? "Saving…" : editing ? "Save Changes" : "Add Question"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
