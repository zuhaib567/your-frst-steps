import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { StageBadge } from "@/components/shepherd/StageTracker";
import { PriorityPill } from "@/components/shepherd/Pills";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Stage } from "@/lib/shepherd/types";
import { STAGES } from "@/lib/shepherd/types";

export const Route = createFileRoute("/requests/")({
  component: Requests,
});

function Requests() {
  const requests = useShepherd((s) => s.requests);
  const [filter, setFilter] = useState<Stage | "All">("All");
  const filtered = filter === "All" ? requests : requests.filter((r) => r.currentStage === filter);

  return (
    <AppShell
      title="Requests"
      actions={
        <Link to="/requests/new" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> New Request
        </Link>
      }
    >
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto">
        {(["All", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`shrink-0 rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filter === s ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} <span className="ml-1 font-mono text-[10px] opacity-60">{s === "All" ? requests.length : requests.filter((r) => r.currentStage === s).length}</span>
          </button>
        ))}
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-left font-medium px-4 py-2">ID</th>
              <th className="text-left font-medium px-4 py-2">Summary</th>
              <th className="text-left font-medium px-4 py-2">Requesting</th>
              <th className="text-left font-medium px-4 py-2">Stage</th>
              <th className="text-left font-medium px-4 py-2">Priority</th>
              <th className="text-left font-medium px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-accent/40">
                <td className="px-4 py-2.5 font-mono text-[12px]">
                  <Link to="/requests/$id" params={{ id: r.id }} className="text-muted-foreground hover:text-primary">{r.id}</Link>
                </td>
                <td className="px-4 py-2.5">
                  <Link to="/requests/$id" params={{ id: r.id }} className="hover:text-primary">{r.summary}</Link>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.requestingDept}</td>
                <td className="px-4 py-2.5"><StageBadge stage={r.currentStage} /></td>
                <td className="px-4 py-2.5"><PriorityPill p={r.priority} /></td>
                <td className="px-4 py-2.5 text-muted-foreground text-[12px]">{formatDistanceToNow(new Date(r.createdOn))} ago</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-[13px]">No requests at this stage.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
