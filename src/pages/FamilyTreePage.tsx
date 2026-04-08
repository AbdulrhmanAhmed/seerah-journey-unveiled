import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { GitBranch, X, ChevronDown, ChevronUp, Calendar, User, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ancestor: "bg-amber-50 border-amber-300 text-amber-800",
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
  foster_sibling: "bg-teal-50 border-teal-300 text-teal-800",
  other: "bg-muted border-border text-foreground",
};

const relationLabels: Record<string, { ar: string; en: string }> = {
  ancestor: { ar: "جد أعلى", en: "Ancestor" },
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
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [showFullLineage, setShowFullLineage] = useState(false);

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

  const getChildren = (parentId: string | null) =>
    members.filter((m) => m.parent_id === parentId).sort((a, b) => a.display_order - b.display_order);

  // Build ancestor chain (linear path from Ibrahim to Abdul-Muttalib)
  const buildAncestorChain = () => {
    const chain: FamilyMember[] = [];
    const roots = getChildren(null);
    if (roots.length === 0) return chain;

    let current = roots[0];
    chain.push(current);

    while (true) {
      const children = getChildren(current.id);
      const nextAncestor = children.find(
        (c) => c.relation_type === "ancestor" || c.relation_type === "grandfather"
      );
      if (!nextAncestor) break;
      chain.push(nextAncestor);
      current = nextAncestor;
    }
    return chain;
  };

  const ancestorChain = buildAncestorChain();
  const lastAncestor = ancestorChain[ancestorChain.length - 1];

  const renderNode = (member: FamilyMember, depth: number = 0) => {
    const children = getChildren(member.id);
    const colorClass = relationColors[member.relation_type] || relationColors.other;
    const isProphet = member.relation_type === "prophet";

    // Skip ancestors (they're rendered separately)
    if (member.relation_type === "ancestor") return null;

    return (
      <div key={member.id} className="flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelected(member)}
          className={`relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl border-2 text-center transition-shadow hover:shadow-md ${colorClass} ${
            isProphet ? "ring-2 ring-secondary ring-offset-2 shadow-lg" : ""
          }`}
          style={{ minWidth: isProphet ? 160 : depth > 2 ? 100 : 120 }}
        >
          <div className={`font-bold text-xs md:text-sm ${isProphet ? "md:text-base" : ""}`}>
            {isAr ? member.name : member.name_en}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            {relationLabels[member.relation_type]?.[isAr ? "ar" : "en"] || member.relation_type}
          </div>
        </motion.button>

        {children.length > 0 && (
          <>
            <div className="w-px h-5 bg-border" />
            {children.length > 1 && (
              <div className="relative w-full flex justify-center">
                <div
                  className="h-px bg-border"
                  style={{
                    width: `calc(100% - 60px)`,
                    maxWidth: `${(children.length - 1) * 140}px`,
                  }}
                />
              </div>
            )}
            <div className="flex gap-1.5 md:gap-3 flex-wrap justify-center">
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-5 bg-border" />
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render the tree starting from Abdul-Muttalib (grandfather)
  const renderMainTree = () => {
    if (!lastAncestor) return null;
    const mainBranch = getChildren(lastAncestor.id);
    if (mainBranch.length === 0) return null;

    // Separate Abdullah (father) from uncles and aunts
    const father = mainBranch.find(m => m.relation_type === "father");
    const uncles = mainBranch.filter(m => m.relation_type === "uncle");
    const aunts = mainBranch.filter(m => m.relation_type === "aunt");

    const renderRelativesGrid = (
      relatives: FamilyMember[],
      type: "uncle" | "aunt",
      labelAr: string,
      labelEn: string
    ) => {
      if (relatives.length === 0) return null;
      return (
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center text-xs font-medium text-muted-foreground mb-3 px-3 py-1 rounded-full bg-muted/50 inline-block mx-auto">
            {isAr ? `${labelAr} (${relatives.length})` : `${labelEn} (${relatives.length})`}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {relatives.map((rel) => (
              <motion.button
                key={rel.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(rel)}
                className={`px-3 py-2 rounded-xl border-2 text-center transition-shadow hover:shadow-md ${relationColors[type]}`}
                style={{ minWidth: 100 }}
              >
                <div className="font-bold text-xs">
                  {isAr ? rel.name : rel.name_en}
                </div>
                <div className="text-[10px] opacity-70 mt-0.5">
                  {relationLabels[type][isAr ? "ar" : "en"]}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center gap-0">
        {/* Grandfather node */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelected(lastAncestor)}
          className={`px-4 py-2.5 rounded-xl border-2 text-center transition-shadow hover:shadow-md ${
            relationColors[lastAncestor.relation_type] || relationColors.other
          }`}
          style={{ minWidth: 160 }}
        >
          <div className="font-bold text-sm">
            {isAr ? lastAncestor.name : lastAncestor.name_en}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            {relationLabels[lastAncestor.relation_type]?.[isAr ? "ar" : "en"]}
          </div>
        </motion.button>

        <div className="w-px h-5 bg-border" />

        {/* Father branch + Uncles + Aunts */}
        <div className="flex flex-col items-center gap-6 w-full">
          {father && (
            <div className="flex flex-col items-center">
              {renderNode(father, 1)}
            </div>
          )}

          {renderRelativesGrid(uncles, "uncle", "أعمام النبي ﷺ", "Prophet's Uncles")}
          {renderRelativesGrid(aunts, "aunt", "عمات النبي ﷺ", "Prophet's Aunts")}
        </div>
      </div>
    );
  };

  // Compact ancestor lineage display
  const renderAncestorLineage = () => {
    if (ancestorChain.length <= 1) return null;
    // Remove the last one (grandfather) since it's the main tree root
    const ancestors = ancestorChain.slice(0, -1);

    if (!showFullLineage) {
      // Show collapsed: Ibrahim → ... → Hashim
      const first = ancestors[0];
      const last = ancestors[ancestors.length - 1];
      return (
        <div className="flex flex-col items-center mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(first)}
            className={`px-4 py-2 rounded-xl border-2 text-center ${relationColors.ancestor}`}
          >
            <div className="font-bold text-sm">{isAr ? first.name : first.name_en}</div>
            <div className="text-[10px] opacity-70">{isAr ? "جد أعلى" : "Ancestor"}</div>
          </motion.button>

          <button
            onClick={() => setShowFullLineage(true)}
            className="flex items-center gap-1 my-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-muted/80 transition-colors"
          >
            <ChevronDown size={12} />
            {isAr
              ? `${ancestors.length - 1} جد بينهما — اضغط للعرض`
              : `${ancestors.length - 1} ancestors between — click to expand`}
          </button>

          {ancestors.length > 1 && first.id !== last.id && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(last)}
                className={`px-4 py-2 rounded-xl border-2 text-center ${relationColors.ancestor}`}
              >
                <div className="font-bold text-sm">{isAr ? last.name : last.name_en}</div>
                <div className="text-[10px] opacity-70">{isAr ? "جد أعلى" : "Ancestor"}</div>
              </motion.button>
              <div className="w-px h-5 bg-border" />
            </>
          )}
        </div>
      );
    }

    // Full lineage
    return (
      <div className="flex flex-col items-center mb-2">
        <button
          onClick={() => setShowFullLineage(false)}
          className="flex items-center gap-1 mb-3 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-muted/80 transition-colors"
        >
          <ChevronUp size={12} />
          {isAr ? "طيّ النسب" : "Collapse lineage"}
        </button>
        {ancestors.map((anc, i) => (
          <div key={anc.id} className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelected(anc)}
              className={`px-3 py-1.5 rounded-lg border text-center ${relationColors.ancestor}`}
            >
              <div className="font-bold text-xs">{isAr ? anc.name : anc.name_en}</div>
            </motion.button>
            {i < ancestors.length - 1 && <div className="w-px h-4 bg-border" />}
          </div>
        ))}
        <div className="w-px h-5 bg-border" />
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
              ? "استكشف نسب النبي ﷺ من إبراهيم عليه السلام — زوجاته وأبناؤه وأحفاده"
              : "Explore the Prophet's ﷺ lineage from Ibrahim — his wives, children, and grandchildren"}
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
          <div className="pb-8">
            <div className="flex flex-col items-center gap-0 mx-auto">
              {renderAncestorLineage()}
              {renderMainTree()}
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
            className={`fixed top-20 ${isAr ? "left-4" : "right-4"} w-80 max-h-[75vh] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="p-5 pb-3 border-b border-border/50">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 end-3 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
              <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs mb-2 font-medium ${relationColors[selected.relation_type] || relationColors.other}`}>
                {relationLabels[selected.relation_type]?.[isAr ? "ar" : "en"] || selected.relation_type}
              </div>
              <h3 className="text-lg font-bold font-amiri text-foreground">
                {isAr ? selected.name : selected.name_en}
              </h3>
              {(selected.birth_year || selected.death_year) && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>
                    {selected.birth_year && selected.birth_year}
                    {selected.birth_year && selected.death_year && " — "}
                    {selected.death_year && selected.death_year}
                  </span>
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-5 pt-3 space-y-4">
                {/* Bio */}
                {(isAr ? selected.bio : selected.bio_en) && (
                  <div>
                    <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                      {isAr ? selected.bio : selected.bio_en}
                    </p>
                  </div>
                )}

                {/* Children list for wives */}
                {selected.relation_type === "wife" && (() => {
                  const children = members.filter(m => m.parent_id === selected.id);
                  if (children.length === 0) return null;
                  return (
                    <div className="pt-2 border-t border-border/50">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                        <User size={12} />
                        {isAr ? "الأبناء" : "Children"}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => setSelected(child)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors hover:shadow-sm ${relationColors[child.relation_type] || relationColors.other}`}
                          >
                            {isAr ? child.name : child.name_en}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Companion Link */}
                {selected.companion_id && (
                  <div className="pt-2 border-t border-border/50">
                    <Link
                      to={`/companions`}
                      className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
                    >
                      <ExternalLink size={14} />
                      {isAr ? "عرض السيرة الكاملة" : "View Full Profile"}
                    </Link>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyTreePage;
