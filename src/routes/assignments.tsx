import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { AssignmentPill } from "@/components/shepherd/Pills";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/assignments")({ component: Assignments });

function Assignments() {
  const { assignments, departments, setAssignmentStatus } = useShepherd();
  return (
    <AppShell title="Assignments">
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-left font-medium px-4 py-2">Request</th>
              <th className="text-left font-medium px-4 py-2">Department</th>
              <th className="text-left font-medium px-4 py-2">Status</th>
              <th className="text-left font-medium px-4 py-2">Sent</th>
              <th className="text-left font-medium px-4 py-2">Responded</th>
              <th className="text-right font-medium px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => {
              const d = departments.find((x) => x.id === a.departmentId);
              return (
                <tr key={a.id} className="border-t border-border/60 hover:bg-accent/40">
                  <td className="px-4 py-2.5">
                    <Link to="/requests/$id" params={{ id: a.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{a.requestId}</Link>
                  </td>
                  <td className="px-4 py-2.5">{d?.name}</td>
                  <td className="px-4 py-2.5"><AssignmentPill s={a.status} /></td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[12px]">{formatDistanceToNow(new Date(a.sentOn))} ago</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[12px]">{a.respondedOn ? formatDistanceToNow(new Date(a.respondedOn)) + " ago" : "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1">
                      <Link to="/respond/$token" params={{ token: a.id }} className="rounded-sm border border-border px-2 py-0.5 text-[11px] hover:bg-accent">View</Link>
                      <button onClick={() => setAssignmentStatus(a.id, "Completed")} className="rounded-sm border border-border px-2 py-0.5 text-[11px] hover:bg-accent">Complete</button>
                      <button onClick={() => setAssignmentStatus(a.id, "Escalated")} className="rounded-sm border border-warning/30 text-warning px-2 py-0.5 text-[11px] hover:bg-warning/10">Escalate</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
