import { BookOpen, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* Sources & Authenticity */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-secondary" />
            <h3 className="font-serif-display text-xl text-foreground">
              Sources & Authenticity
            </h3>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
            Every piece of content on The Seerah Path is grounded in authentic, scholarly sources.
            We rely on classical works such as <em>Ar-Raheeq Al-Makhtum</em> (The Sealed Nectar),
            <em> As-Seerah An-Nabawiyyah</em> by Ibn Hisham, and verified Hadith collections
            including Sahih Al-Bukhari and Sahih Muslim.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-secondary/60" />
              Peer-reviewed content
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Authentic sources only</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Scholarly references</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <p className="font-serif-display text-sm text-foreground/60">
            The Seerah Path
          </p>
          <p>
            © {new Date().getFullYear()} The Seerah Path. Built with reverence and authenticity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
