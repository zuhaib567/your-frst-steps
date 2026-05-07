import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/escalations")({ component: Escalations });

function Escalations() {
  const escalations = useShepherd((s) => s.escalations);
  return (
    <AppShell title="Escalations">
      <div className="rounded-md border border-border bg-card divide-y divide-border">
        {escalations.map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-4 py-3">
            <AlertTriangle className={`h-4 w-4 ${e.resolved ? "text-success" : "text-warning"}`} />
            <Link to="/requests/$id" params={{ id: e.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{e.requestId}</Link>
            <div className="flex-1 text-[13px]">{e.reason}</div>
            <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(e.createdOn))} ago</span>
            <span className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${e.resolved ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning"}`}>
              {e.resolved ? "Resolved" : "Open"}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
