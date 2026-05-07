import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { format } from "date-fns";

export const Route = createFileRoute("/audit")({ component: Audit });

function Audit() {
  const audit = useShepherd((s) => s.audit);
  return (
    <AppShell title="Audit Log">
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-left font-medium px-4 py-2 w-44">Timestamp</th>
              <th className="text-left font-medium px-4 py-2">Request</th>
              <th className="text-left font-medium px-4 py-2">Actor</th>
              <th className="text-left font-medium px-4 py-2">Action</th>
              <th className="text-left font-medium px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((a) => (
              <tr key={a.id} className="border-t border-border/60">
                <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">{format(new Date(a.ts), "MMM d, HH:mm")}</td>
                <td className="px-4 py-2">
                  {a.requestId ? <Link to="/requests/$id" params={{ id: a.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{a.requestId}</Link> : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-2">{a.actor}</td>
                <td className="px-4 py-2">{a.action}</td>
                <td className="px-4 py-2 text-muted-foreground text-[12px]">{a.detail ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
