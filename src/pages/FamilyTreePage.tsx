import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { GitBranch, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FamilyMember = {
  id: string;
  name: string;
  name_en: string;
  relation_type: string;
  parent_id: string | null;
  companion_id: string | null;
  birth_year: string;
  death_year: string;
  bio: string;
  bio_en: string;
  gender: string;
  display_order: number;
};

const relationColors: Record<string, string> = {
  grandfather: "bg-amber-100 border-amber-400 text-amber-900",
  father: "bg-amber-100 border-amber-400 text-amber-900",
  mother: "bg-rose-50 border-rose-300 text-rose-900",
  prophet: "bg-emerald-100 border-emerald-500 text-emerald-900",
  wife: "bg-rose-50 border-rose-300 text-rose-900",
  son: "bg-sky-50 border-sky-300 text-sky-900",
  daughter: "bg-purple-50 border-purple-300 text-purple-900",
  uncle: "bg-amber-50 border-amber-300 text-amber-800",
  aunt: "bg-pink-50 border-pink-300 text-pink-800",
  grandson: "bg-sky-50 border-sky-200 text-sky-800",
  granddaughter: "bg-purple-50 border-purple-200 text-purple-800",
  other: "bg-muted border-border text-foreground",
};

const relationLabels: Record<string, { ar: string; en: string }> = {
  grandfather: { ar: "جد", en: "Grandfather" },
  father: { ar: "أب", en: "Father" },
  mother: { ar: "أم", en: "Mother" },
  prophet: { ar: "النبي ﷺ", en: "The Prophet ﷺ" },
  wife: { ar: "زوجة", en: "Wife" },
  son: { ar: "ابن", en: "Son" },
  daughter: { ar: "ابنة", en: "Daughter" },
  uncle: { ar: "عم", en: "Uncle" },
  aunt: { ar: "عمة", en: "Aunt" },
  grandson: { ar: "حفيد", en: "Grandson" },
  granddaughter: { ar: "حفيدة", en: "Granddaughter" },
};

const FamilyTreePage = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["family_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data || []) as FamilyMember[];
    },
  });

  // Build tree structure
  const getChildren = (parentId: string | null) =>
    members.filter((m) => m.parent_id === parentId).sort((a, b) => a.display_order - b.display_order);

  const roots = getChildren(null);

  const renderNode = (member: FamilyMember, depth: number = 0) => {
    const children = getChildren(member.id);
    const colorClass = relationColors[member.relation_type] || relationColors.other;
    const isProphet = member.relation_type === "prophet";

    return (
      <div key={member.id} className="flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelected(member)}
          className={`relative px-4 py-2.5 rounded-xl border-2 text-center transition-shadow hover:shadow-md ${colorClass} ${
            isProphet ? "ring-2 ring-secondary ring-offset-2 shadow-lg" : ""
          }`}
          style={{ minWidth: isProphet ? 160 : 120 }}
        >
          <div className={`font-bold text-sm ${isProphet ? "text-base" : ""}`}>
            {isAr ? member.name : member.name_en}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            {relationLabels[member.relation_type]?.[isAr ? "ar" : "en"] || member.relation_type}
          </div>
        </motion.button>

        {children.length > 0 && (
          <>
            {/* Vertical connector */}
            <div className="w-px h-6 bg-border" />
            {/* Horizontal line spanning children */}
            {children.length > 1 && (
              <div className="relative flex items-start">
                <div
                  className="absolute top-0 h-px bg-border"
                  style={{
                    left: "50%",
                    right: "50%",
                    transform: `translateX(-${(children.length - 1) * 50}%)`,
                    width: `${(children.length - 1) * 100}%`,
                    maxWidth: `${(children.length - 1) * 160}px`,
                  }}
                />
              </div>
            )}
            <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-6 bg-border" />
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <GitBranch size={16} />
            <span>{isAr ? "شجرة العائلة" : "Family Tree"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-amiri mb-3">
            {isAr ? "شجرة عائلة النبي ﷺ" : "Family Tree of the Prophet ﷺ"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? "استكشف نسب النبي ﷺ وعائلته — زوجاته وأبناؤه وأحفاده"
              : "Explore the lineage of the Prophet ﷺ — his wives, children, and grandchildren"}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(relationLabels).map(([key, label]) => (
            <div
              key={key}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${
                relationColors[key] || relationColors.other
              }`}
            >
              {isAr ? label.ar : label.en}
            </div>
          ))}
        </div>

        {/* Tree */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {isAr ? "لم تُضَف بيانات العائلة بعد" : "Family data not yet added"}
          </div>
        ) : (
          <div className="overflow-x-auto pb-8">
            <div className="flex flex-col items-center gap-0 min-w-fit mx-auto">
              {roots.map((root) => renderNode(root))}
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: isAr ? -300 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? -300 : 300 }}
            className={`fixed top-20 ${isAr ? "left-4" : "right-4"} w-80 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl z-50 p-5`}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 end-3 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${relationColors[selected.relation_type] || relationColors.other}`}>
              {relationLabels[selected.relation_type]?.[isAr ? "ar" : "en"] || selected.relation_type}
            </div>
            <h3 className="text-lg font-bold font-amiri text-foreground mb-1">
              {isAr ? selected.name : selected.name_en}
            </h3>
            {selected.birth_year && (
              <p className="text-xs text-muted-foreground mb-3">
                {selected.birth_year}
                {selected.death_year && ` — ${selected.death_year}`}
              </p>
            )}
            <p className="text-sm leading-relaxed text-foreground/80">
              {isAr ? selected.bio : selected.bio_en}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyTreePage;
