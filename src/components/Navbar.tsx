import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, Heart, Menu, X, Map, Brain, GitBranch, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import seerahLogo from "@/assets/seerah-logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const pillars = [
    { name: t("navJourney"), icon: Clock, path: "/journey" },
    { name: t("navCharacter"), icon: Heart, path: "/character" },
    { name: t("navInteractiveJourney"), icon: Map, path: "/interactive-journey" },
    
    { name: t("navQuiz"), icon: Brain, path: "/quiz" },
    { name: t("navFamilyTree"), icon: GitBranch, path: "/family-tree" },
    { name: t("navCompanions"), icon: Users, path: "/companions" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <img src={seerahLogo} alt="Seerah Story" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {pillars.map(({ name, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  "hover:bg-secondary/10 hover:text-secondary",
                  "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300 hover:after:w-3/4",
                  location.pathname === path
                    ? "text-secondary after:w-3/4"
                    : "text-foreground/70"
                )}
              >
                <Icon size={16} />
                <span>{name}</span>
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-foreground/70 hover:text-secondary transition-colors"
              aria-label={t("menuLabel")}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {pillars.map(({ name, icon: Icon, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-secondary/10 hover:text-secondary",
                    location.pathname === path
                      ? "text-secondary bg-secondary/5"
                      : "text-foreground/70"
                  )}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
