import { Link } from "react-router-dom";
import { Clock, Heart, Compass, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  {
    title: "The Journey",
    icon: Clock,
    path: "/journey",
    description: "Trace the timeline of the Prophet's ﷺ life — from birth in Makkah to the establishment of a civilization in Madinah.",
  },
  {
    title: "The Character",
    icon: Heart,
    path: "/character",
    description: "Discover the noble qualities, teachings, and timeless wisdom of the best of creation ﷺ.",
  },
  {
    title: "The Map",
    icon: Compass,
    path: "/map",
    description: "Explore the lands, routes, and sacred places connected to the Prophetic mission.",
  },
  {
    title: "The Library",
    icon: BookOpen,
    path: "/library",
    description: "Access authentic sources, scholarly works, and multimedia resources on the Seerah.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const PillarsSection = () => {
  return (
    <section id="pillars-section" className="py-24 md:py-32 islamic-pattern">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            The Four Pillars
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Navigate the Seerah through four interconnected dimensions — each one a doorway to deeper understanding.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {pillars.map(({ title, icon: Icon, path, description }) => (
            <motion.div key={path} variants={item}>
              <Link
                to={path}
                className="group block p-8 rounded-xl bg-card border border-border hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Icon size={22} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif-display text-xl text-foreground mb-2 group-hover:text-secondary transition-colors">
                      {title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PillarsSection;
