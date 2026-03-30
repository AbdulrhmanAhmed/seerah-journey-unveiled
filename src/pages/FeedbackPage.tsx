import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquarePlus, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === "ar";
  const { toast } = useToast();

  const [type, setType] = useState("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("feedback" as any).insert({
      type,
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      page_url: window.location.href,
    } as any);

    setSubmitting(false);

    if (error) {
      toast({
        title: isAr ? "حدث خطأ" : "Error",
        description: isAr ? "لم نتمكن من إرسال رسالتك. حاول مرة أخرى." : "Could not send your message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: isAr ? "تم الإرسال بنجاح" : "Sent Successfully",
        description: isAr ? "شكراً لمساهمتك! سنراجع رسالتك قريباً." : "Thank you for your contribution! We'll review your message soon.",
      });
      setType("suggestion");
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  const typeOptions = [
    { value: "suggestion", label: isAr ? "اقتراح" : "Suggestion", icon: Lightbulb },
    { value: "idea", label: isAr ? "فكرة جديدة" : "New Idea", icon: MessageSquarePlus },
    { value: "mistake", label: isAr ? "تنبيه على خطأ" : "Report a Mistake", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif-display text-3xl md:text-4xl text-foreground mb-3">
            {isAr ? "شاركنا رأيك" : "Share Your Feedback"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            {isAr
              ? "ساعدنا في تحسين الموقع — أرسل اقتراحاتك أو أفكارك أو نبّهنا على أي خطأ."
              : "Help us improve — send your suggestions, ideas, or alert us to any mistakes."}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm"
        >
          {/* Type */}
          <div className="space-y-2">
            <Label className="text-foreground">{isAr ? "نوع الرسالة" : "Message Type"}</Label>
            <div className="grid grid-cols-3 gap-3">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all ${
                      type === opt.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border text-muted-foreground hover:border-secondary/40"
                    }`}
                  >
                    <Icon size={20} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-foreground">
              {isAr ? "الاسم" : "Name"}{" "}
              <span className="text-muted-foreground text-xs">({isAr ? "اختياري" : "optional"})</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder={isAr ? "اسمك" : "Your name"} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-foreground">
              {isAr ? "البريد الإلكتروني" : "Email"}{" "}
              <span className="text-muted-foreground text-xs">({isAr ? "اختياري" : "optional"})</span>
            </Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"} />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-foreground">{isAr ? "الرسالة" : "Message"} *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={5}
              required
              placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
            />
            <p className="text-xs text-muted-foreground text-end">{message.length}/2000</p>
          </div>

          <Button type="submit" disabled={submitting || !message.trim()} className="w-full gap-2">
            <Send size={16} />
            {submitting ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال" : "Send")}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default FeedbackPage;
