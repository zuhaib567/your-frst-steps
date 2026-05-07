import type { Stage } from "@/lib/shepherd/types";
import { STAGES } from "@/lib/shepherd/types";
import { Check } from "lucide-react";

export function StageTracker({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s} className="flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : done
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {done ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
              )}
              <span>{s}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-px w-4 ${i < idx ? "bg-success/40" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  const idx = STAGES.indexOf(stage);
  const tone =
    stage === "Completed" || stage === "Closed"
      ? "bg-success/10 text-success border-success/20"
      : stage === "In Progress"
      ? "bg-warning/10 text-warning border-warning/20"
      : "bg-info/10 text-info border-info/20";
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
      <span className="font-mono opacity-60">{String(idx + 1).padStart(2, "0")}</span>
      {stage}
    </span>
  );
}
