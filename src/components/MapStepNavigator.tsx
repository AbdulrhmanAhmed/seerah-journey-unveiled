import { ChevronLeft, ChevronRight, Play, Pause, Square } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Progress } from "@/components/ui/progress";
import type { MapPath } from "@/data/mapPaths";

interface MapStepNavigatorProps {
  path: MapPath;
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
}

const MapStepNavigator = ({
  path,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onStop,
}: MapStepNavigatorProps) => {
  const { lang } = useLanguage();
  const step = path.steps[currentStep];
  const progress = ((currentStep + 1) / path.steps.length) * 100;
  const stepLabel = lang === "ar" ? step.label : step.labelEn;
  const stepDesc = lang === "ar" ? step.description : step.descriptionEn;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30">
      <div className="max-w-lg mx-auto rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg overflow-hidden">
        {/* Progress bar */}
        <Progress value={progress} className="h-1 rounded-none" />

        <div className="p-3">
          {/* Step info */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[11px] text-muted-foreground">
              {lang === "ar"
                ? `الخطوة ${currentStep + 1} من ${path.steps.length}`
                : `Step ${currentStep + 1} of ${path.steps.length}`}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `hsl(${path.lineColor})` }}
            />
          </div>

          <h4 className="font-serif-display text-base text-foreground mb-1">{stepLabel}</h4>
          <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{stepDesc}</p>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={onTogglePlay}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              {isPlaying && (
                <button
                  onClick={onStop}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  <Square size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onStepChange(currentStep - 1)}
                disabled={currentStep === 0}
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Step dots */}
              <div className="flex items-center gap-1 px-2">
                {path.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onStepChange(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "scale-125"
                        : i < currentStep
                        ? "opacity-60"
                        : "opacity-30"
                    }`}
                    style={{
                      backgroundColor:
                        i <= currentStep
                          ? `hsl(${path.lineColor})`
                          : "hsl(var(--muted-foreground))",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => onStepChange(currentStep + 1)}
                disabled={currentStep === path.steps.length - 1}
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStepNavigator;
