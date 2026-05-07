import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { StageBadge } from "@/components/shepherd/StageTracker";
import { PriorityPill } from "@/components/shepherd/Pills";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock, Inbox, CheckSquare, Zap, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — SHEPHERD" },
      { name: "description", content: "Operational control dashboard for SHEPHERD." },
    ],
  }),
});

function StatCard({ label, value, sub, icon: Icon, tone }: { label: string; value: number | string; sub?: string; icon: any; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className={`h-3.5 w-3.5 ${tone ?? "text-muted-foreground"}`} />
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Dashboard() {
  const { requests, approvals, assignments, escalations, audit } = useShepherd();
  const open = requests.filter((r) => r.currentStage !== "Closed" && r.currentStage !== "Completed").length;
  const pendingApprovals = approvals.filter((a) => a.state === "Pending").length;
  const activeAssignments = assignments.filter((a) => !["Completed", "Denied"].includes(a.status)).length;
  const openEsc = escalations.filter((e) => !e.resolved).length;
  const overdue = requests.filter((r) => Date.now() - new Date(r.stageStartedOn).getTime() > 3 * 86400000 && r.currentStage !== "Closed").length;

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Open Requests" value={open} icon={Inbox} sub="across all stages" />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={CheckSquare} tone="text-info" />
        <StatCard label="Active Assignments" value={activeAssignments} icon={Zap} tone="text-info" />
        <StatCard label="Escalations" value={openEsc} icon={AlertTriangle} tone="text-warning" />
        <StatCard label="Overdue" value={overdue} icon={Clock} tone="text-destructive" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section
            title="Recent Requests"
            action={
              <Link to="/requests" className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                All requests <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            <table className="w-full text-[13px]">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left font-medium px-4 py-2">ID</th>
                  <th className="text-left font-medium px-4 py-2">Summary</th>
                  <th className="text-left font-medium px-4 py-2">Stage</th>
                  <th className="text-left font-medium px-4 py-2">Priority</th>
                  <th className="text-left font-medium px-4 py-2">Age</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 6).map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                    <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">
                      <Link to="/requests/$id" params={{ id: r.id }} className="hover:text-primary">{r.id}</Link>
                    </td>
                    <td className="px-4 py-2">{r.summary}</td>
                    <td className="px-4 py-2"><StageBadge stage={r.currentStage} /></td>
                    <td className="px-4 py-2"><PriorityPill p={r.priority} /></td>
                    <td className="px-4 py-2 text-muted-foreground text-[12px]">{formatDistanceToNow(new Date(r.createdOn))} ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Needs Attention">
            <ul className="divide-y divide-border">
              {escalations.filter((e) => !e.resolved).map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <Link to="/requests/$id" params={{ id: e.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{e.requestId}</Link>
                  <span className="text-[13px] flex-1">{e.reason}</span>
                  <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(e.createdOn))} ago</span>
                </li>
              ))}
              {approvals.filter((a) => a.state === "Pending").map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <CheckSquare className="h-4 w-4 text-info shrink-0" />
                  <Link to="/requests/$id" params={{ id: a.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{a.requestId}</Link>
                  <span className="text-[13px] flex-1">Awaiting approval — {a.approver}</span>
                  <Link to="/approvals" className="text-[11px] text-primary hover:underline">Review</Link>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div>
          <Section title="Activity Feed">
            <ul className="divide-y divide-border max-h-[520px] overflow-auto">
              {audit.slice(0, 12).map((a) => (
                <li key={a.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium">{a.action}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{formatDistanceToNow(new Date(a.ts))}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.requestId && <span className="font-mono mr-1.5">{a.requestId}</span>}
                    by {a.actor}
                  </div>
                  {a.detail && <div className="text-[11px] text-muted-foreground/80 mt-0.5">{a.detail}</div>}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
