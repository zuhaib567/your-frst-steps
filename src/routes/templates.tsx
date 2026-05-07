import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { useState } from "react";

export const Route = createFileRoute("/templates")({ component: Templates });

function Templates() {
  const templates = useShepherd((s) => s.templates);
  const [active, setActive] = useState(templates[0].id);
  const t = templates.find((x) => x.id === active)!;
  return (
    <AppShell title="Templates">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        <div className="rounded-md border border-border bg-card overflow-hidden">
          {templates.map((tt) => (
            <button
              key={tt.id}
              onClick={() => setActive(tt.id)}
              className={`block w-full text-left px-3 py-2.5 border-b border-border/60 last:border-0 text-[13px] ${active === tt.id ? "bg-accent" : "hover:bg-accent/40"}`}
            >
              <div className="font-medium">{tt.name}</div>
              <div className="text-[11px] text-muted-foreground">{tt.type}</div>
            </button>
          ))}
        </div>
        <div className="rounded-md border border-border bg-card p-4 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Subject</div>
            <input defaultValue={t.subject} className="mt-1 w-full rounded-sm border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Body</div>
            <textarea defaultValue={t.body} rows={10} className="mt-1 w-full rounded-sm border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none font-mono" />
          </div>
          <div className="text-[11px] text-muted-foreground">
            Variables:{" "}
            {["{{RequestID}}", "{{RequestSummary}}", "{{DepartmentName}}", "{{AcceptLink}}", "{{DenyLink}}"].map((v) => (
              <code key={v} className="mr-1.5 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px]">{v}</code>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
