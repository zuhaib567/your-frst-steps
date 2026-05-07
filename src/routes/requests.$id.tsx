import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { StageTracker } from "@/components/shepherd/StageTracker";
import { AssignmentPill, ApprovalPill, PriorityPill } from "@/components/shepherd/Pills";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronLeft, Mail } from "lucide-react";

export const Route = createFileRoute("/requests/$id")({
  component: RequestDetail,
  notFoundComponent: () => (
    <AppShell title="Not found">
      <div className="text-muted-foreground text-[13px]">Request not found. <Link to="/requests" className="text-primary">Back to list</Link></div>
    </AppShell>
  ),
});

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function RequestDetail() {
  const { id } = Route.useParams();
  const { requests, assignments, approvals, departments, audit, decideApproval, setAssignmentStatus, advanceStage } =
    useShepherd();
  const r = requests.find((x) => x.id === id);
  if (!r) throw notFound();

  const myAssignments = assignments.filter((a) => a.requestId === r.id);
  const myApprovals = approvals.filter((a) => a.requestId === r.id);
  const events = audit.filter((a) => a.requestId === r.id);
  const allComplete = myAssignments.length > 0 && myAssignments.every((a) => a.status === "Completed" || a.status === "Denied");

  return (
    <AppShell title={`${r.id} · ${r.summary}`}>
      <div className="mb-4">
        <Link to="/requests" className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" /> All requests
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card p-4 mb-4">
        <StageTracker current={r.currentStage} />
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>Stage started {formatDistanceToNow(new Date(r.stageStartedOn))} ago</span>
          <span>·</span>
          <span>Created {format(new Date(r.createdOn), "MMM d, yyyy")}</span>
          <div className="ml-auto flex gap-1.5">
            {r.currentStage === "Approved" && (
              <button onClick={() => advanceStage(r.id, "Assigned")} className="rounded-sm border border-border px-2 py-1 text-[11px] hover:bg-accent">Mark Assigned</button>
            )}
            {r.currentStage === "Assigned" && (
              <button onClick={() => advanceStage(r.id, "In Progress")} className="rounded-sm border border-border px-2 py-1 text-[11px] hover:bg-accent">Start Progress</button>
            )}
            {r.currentStage === "In Progress" && (
              <button
                onClick={() => advanceStage(r.id, "Completed")}
                disabled={!allComplete}
                title={!allComplete ? "All assignments must be completed first" : ""}
                className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mark Complete
              </button>
            )}
            {r.currentStage === "Completed" && (
              <button onClick={() => advanceStage(r.id, "Closed")} className="rounded-sm border border-border px-2 py-1 text-[11px] hover:bg-accent">Close Request</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Details">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Priority</div>
                <div className="mt-1"><PriorityPill p={r.priority} /></div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Requesting Dept</div>
                <div className="mt-1">{r.requestingDept}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</div>
                <p className="mt-1 leading-relaxed">{r.details}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Contact</div>
                <div className="mt-1">{r.contactName}</div>
                <div className="text-[12px] text-muted-foreground">{r.contactEmail} · {r.contactPhone}</div>
              </div>
            </div>
          </Card>

          <Card title="Assignments">
            <table className="w-full text-[13px]">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left font-medium pb-2">Department</th><th className="text-left font-medium pb-2">Status</th><th className="text-left font-medium pb-2">Sent</th><th className="text-right font-medium pb-2">Actions</th></tr>
              </thead>
              <tbody>
                {myAssignments.map((a) => {
                  const d = departments.find((x) => x.id === a.departmentId);
                  return (
                    <tr key={a.id} className="border-t border-border/60">
                      <td className="py-2">{d?.name}</td>
                      <td className="py-2"><AssignmentPill s={a.status} /></td>
                      <td className="py-2 text-muted-foreground text-[12px]">{formatDistanceToNow(new Date(a.sentOn))} ago</td>
                      <td className="py-2 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => setAssignmentStatus(a.id, "Completed")} className="rounded-sm border border-border px-2 py-0.5 text-[11px] hover:bg-accent">Complete</button>
                          <button onClick={() => setAssignmentStatus(a.id, "Escalated")} className="rounded-sm border border-warning/30 text-warning px-2 py-0.5 text-[11px] hover:bg-warning/10">Escalate</button>
                          <Link to="/respond/$token" params={{ token: a.id }} className="rounded-sm border border-border px-2 py-0.5 text-[11px] hover:bg-accent inline-flex items-center gap-1"><Mail className="h-3 w-3" />Resend</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {myAssignments.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No assignments yet.</td></tr>}
              </tbody>
            </table>
          </Card>

          <Card title="Approvals">
            <ul className="divide-y divide-border">
              {myApprovals.map((ap) => (
                <li key={ap.id} className="flex items-center gap-3 py-2 text-[13px]">
                  <span className="flex-1">{ap.approver}</span>
                  <ApprovalPill s={ap.state} />
                  {ap.state === "Pending" ? (
                    <div className="flex gap-1">
                      <button onClick={() => decideApproval(r.id, "Approved")} className="rounded-sm bg-success/15 text-success border border-success/30 px-2 py-0.5 text-[11px]">Approve</button>
                      <button onClick={() => decideApproval(r.id, "Denied", "Denied via detail view")} className="rounded-sm bg-destructive/15 text-destructive border border-destructive/30 px-2 py-0.5 text-[11px]">Deny</button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{ap.decidedOn && formatDistanceToNow(new Date(ap.decidedOn)) + " ago"}</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div>
          <Card title="Timeline">
            <ol className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="relative pl-4 border-l border-border">
                  <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="text-[12px] font-medium">{ev.action}</div>
                  <div className="text-[11px] text-muted-foreground">{ev.actor} · {formatDistanceToNow(new Date(ev.ts))} ago</div>
                  {ev.detail && <div className="text-[11px] text-muted-foreground/80 mt-0.5">{ev.detail}</div>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
