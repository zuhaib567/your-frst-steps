import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { ApprovalPill } from "@/components/shepherd/Pills";
import { useState } from "react";

export const Route = createFileRoute("/approvals")({ component: Approvals });

function Approvals() {
  const { approvals, requests, decideApproval } = useShepherd();
  const [comment, setComment] = useState<Record<string, string>>({});
  return (
    <AppShell title="Approvals">
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-left font-medium px-4 py-2">Request</th>
              <th className="text-left font-medium px-4 py-2">Approver</th>
              <th className="text-left font-medium px-4 py-2">State</th>
              <th className="text-left font-medium px-4 py-2 w-1/3">Comment</th>
              <th className="text-right font-medium px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((a) => {
              const r = requests.find((x) => x.id === a.requestId);
              return (
                <tr key={a.id} className="border-t border-border/60">
                  <td className="px-4 py-2.5">
                    <Link to="/requests/$id" params={{ id: a.requestId }} className="font-mono text-[12px] text-muted-foreground hover:text-primary">{a.requestId}</Link>
                    <div className="text-[12px]">{r?.summary}</div>
                  </td>
                  <td className="px-4 py-2.5">{a.approver}</td>
                  <td className="px-4 py-2.5"><ApprovalPill s={a.state} /></td>
                  <td className="px-4 py-2.5">
                    {a.state === "Pending" ? (
                      <input
                        value={comment[a.id] ?? ""}
                        onChange={(e) => setComment({ ...comment, [a.id]: e.target.value })}
                        placeholder="Optional comment"
                        className="w-full rounded-sm border border-input bg-background px-2 py-1 text-[12px] outline-none focus:border-primary/60"
                      />
                    ) : (
                      <span className="text-[12px] text-muted-foreground">{a.comment ?? "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {a.state === "Pending" && (
                      <div className="inline-flex gap-1">
                        <button onClick={() => decideApproval(a.requestId, "Approved", comment[a.id])} className="rounded-sm bg-success/15 text-success border border-success/30 px-2 py-1 text-[11px]">Approve</button>
                        <button onClick={() => decideApproval(a.requestId, "Denied", comment[a.id])} className="rounded-sm bg-destructive/15 text-destructive border border-destructive/30 px-2 py-1 text-[11px]">Deny</button>
                      </div>
                    )}
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
