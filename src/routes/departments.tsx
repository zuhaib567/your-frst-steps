import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";

export const Route = createFileRoute("/departments")({ component: Departments });

function Departments() {
  const departments = useShepherd((s) => s.departments);
  return (
    <AppShell title="Departments">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map((d) => (
          <div key={d.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[14px] font-semibold">{d.name}</div>
                <div className="text-[12px] text-muted-foreground">{d.email}</div>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{d.id}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Owner</div>
                <div className="mt-0.5">{d.owner}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reminder</div>
                <div className="mt-0.5">Every {d.reminderHours}h</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
