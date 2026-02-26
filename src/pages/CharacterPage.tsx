import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const CharacterPage = () => (
  <div className="pt-24 pb-16 min-h-screen islamic-pattern">
    <div className="container mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <Heart size={28} className="text-secondary" />
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-foreground mb-4">The Character</h1>
        <p className="text-muted-foreground font-body">
          Explore the noble qualities and teachings of the Prophet ﷺ — coming soon.
        </p>
      </motion.div>
    </div>
  </div>
);

export default CharacterPage;
