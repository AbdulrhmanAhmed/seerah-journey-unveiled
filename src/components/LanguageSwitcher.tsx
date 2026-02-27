import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-secondary hover:bg-secondary/10 transition-all duration-300"
          aria-label="Language"
        >
          <Globe size={16} />
          <span className="uppercase text-xs font-semibold">{lang}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => setLang("ar")}
          className={`cursor-pointer ${lang === "ar" ? "text-secondary font-semibold" : ""}`}
        >
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLang("en")}
          className={`cursor-pointer ${lang === "en" ? "text-secondary font-semibold" : ""}`}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
