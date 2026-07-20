import { MessageSquarePlus, Swords } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <p className="font-serif-display text-sm text-foreground/60">
            {t("siteName")}
          </p>
          <Link to="/feedback" className="flex items-center gap-1.5 text-sm text-secondary hover:text-secondary/80 transition-colors">
            <MessageSquarePlus size={14} />
            {t("navFeedback")}
          </Link>
          <p>
            © {new Date().getFullYear()} {t("siteName")}. {t("footerCopyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
