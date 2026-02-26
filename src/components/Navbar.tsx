import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, Heart, Compass, BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const pillars = [
  { name: "The Journey", icon: Clock, path: "/journey" },
  { name: "The Character", icon: Heart, path: "/character" },
  { name: "The Map", icon: Compass, path: "/map" },
  { name: "The Library", icon: BookOpen, path: "/library" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="font-serif-display text-xl md:text-2xl font-bold text-primary tracking-wide">
            The Seerah Path
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
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
