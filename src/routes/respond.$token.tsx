import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useShepherd } from "@/lib/shepherd/store";
import { Shield, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/respond/$token")({ component: Respond });

function Respond() {
  const { token } = Route.useParams();
  const { assignments, requests, departments, setAssignmentStatus } = useShepherd();
  const a = assignments.find((x) => x.id === token);
  const [done, setDone] = useState<"" | "Accepted" | "Denied">("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (a && a.status === "Pending") setAssignmentStatus(a.id, "Viewed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!a) throw notFound();
  const r = requests.find((x) => x.id === a.requestId)!;
  const d = departments.find((x) => x.id === a.departmentId)!;

  const decide = (status: "Accepted" | "Denied") => {
    setAssignmentStatus(a.id, status, note);
    setDone(status);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/15 text-primary">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[14px] font-semibold tracking-tight">SHEPHERD</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Department Response · Secure Link</div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
            <span className="rounded-sm border border-info/30 bg-info/10 text-info px-1.5 py-0.5 text-[10px] font-medium">{d.name}</span>
          </div>
          <h1 className="mt-2 text-xl font-semibold">{r.summary}</h1>
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{r.details}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
            <div><span className="text-muted-foreground">Priority:</span> {r.priority}</div>
            <div><span className="text-muted-foreground">Requesting:</span> {r.requestingDept}</div>
            <div><span className="text-muted-foreground">Contact:</span> {r.contactName}</div>
            <div className="text-muted-foreground">{r.contactEmail}</div>
          </div>

          {!done ? (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Optional note to coordinator…"
                className="mt-5 w-full rounded-sm border border-input bg-background px-2.5 py-2 text-[13px] outline-none focus:border-primary/60 resize-none"
              />
              <div className="mt-4 flex gap-2">
                <button onClick={() => decide("Accepted")} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm bg-success/15 text-success border border-success/30 px-3 py-2 text-[13px] font-medium hover:bg-success/20">
                  <Check className="h-4 w-4" /> Accept Assignment
                </button>
                <button onClick={() => decide("Denied")} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm bg-destructive/15 text-destructive border border-destructive/30 px-3 py-2 text-[13px] font-medium hover:bg-destructive/20">
                  <X className="h-4 w-4" /> Deny
                </button>
              </div>
              <div className="mt-3 text-[10px] text-muted-foreground font-mono">
                Token: {token.slice(0, 8)}… · Expires in 72h · Action will be logged
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-sm border border-border bg-muted/40 p-4 text-center">
              <div className="text-[14px] font-medium">Response recorded — {done}</div>
              <div className="text-[12px] text-muted-foreground mt-1">The coordinator has been notified.</div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-[11px] text-muted-foreground hover:text-foreground">Return to platform</Link>
        </div>
      </div>
    </div>
  );
}
