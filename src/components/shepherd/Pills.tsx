import type { Priority, AssignmentStatus, ApprovalState } from "@/lib/shepherd/types";

export function PriorityPill({ p }: { p: Priority }) {
  const tone = {
    Low: "bg-muted text-muted-foreground border-border",
    Normal: "bg-info/10 text-info border-info/20",
    High: "bg-warning/10 text-warning border-warning/20",
    Critical: "bg-destructive/15 text-destructive border-destructive/30",
  }[p];
  return <span className={`inline-flex rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{p}</span>;
}

export function AssignmentPill({ s }: { s: AssignmentStatus }) {
  const tone = {
    Pending: "bg-muted text-muted-foreground border-border",
    Viewed: "bg-info/10 text-info border-info/20",
    Accepted: "bg-success/10 text-success border-success/20",
    Denied: "bg-destructive/15 text-destructive border-destructive/30",
    Completed: "bg-success/15 text-success border-success/30",
    Escalated: "bg-warning/15 text-warning border-warning/30",
  }[s];
  return <span className={`inline-flex rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{s}</span>;
}

export function ApprovalPill({ s }: { s: ApprovalState }) {
  const tone = {
    Pending: "bg-warning/10 text-warning border-warning/20",
    Approved: "bg-success/10 text-success border-success/20",
    Denied: "bg-destructive/15 text-destructive border-destructive/30",
  }[s];
  return <span className={`inline-flex rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{s}</span>;
}
