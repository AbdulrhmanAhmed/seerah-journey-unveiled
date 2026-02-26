import { BookOpen, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-secondary" />
            <h3 className="font-serif-display text-xl text-foreground">
              المصادر والتوثيق
            </h3>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
            كل محتوى في «مسار السيرة» مبني على مصادر علمية موثقة.
            نعتمد على المؤلفات الكلاسيكية مثل <em>الرحيق المختوم</em>،
            و<em>السيرة النبوية</em> لابن هشام، ومجموعات الحديث المعتمدة
            كصحيح البخاري وصحيح مسلم.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-secondary/60" />
              محتوى مراجع علمياً
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>مصادر موثقة فقط</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>مراجع علمية</span>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <p className="font-serif-display text-sm text-foreground/60">
            مسار السيرة
          </p>
          <p>
            © {new Date().getFullYear()} مسار السيرة. بُني بإتقان وأمانة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;