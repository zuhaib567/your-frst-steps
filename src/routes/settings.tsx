import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const users = useShepherd((s) => s.users);
  const Section = ({ title, children }: any) => (
    <div className="rounded-md border border-border bg-card">
      <div className="border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 gap-3 items-center py-2 border-b border-border/60 last:border-0">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <input defaultValue={value} className="col-span-2 rounded-sm border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none" />
    </div>
  );

  return (
    <AppShell title="Settings">
      <div className="space-y-4 max-w-3xl">
        <Section title="Email Configuration">
          <Field label="From address" value="shepherd@org.local" />
          <Field label="Reply-to" value="ops@org.local" />
          <Field label="Token expiration (hours)" value="72" />
        </Section>
        <Section title="Defaults">
          <Field label="Default reminder cadence (hours)" value="24" />
          <Field label="Escalation threshold (hours)" value="48" />
        </Section>
        <Section title="Branding">
          <Field label="System name" value="S.H.E.P.H.E.R.D." />
          <Field label="Tagline" value="Service Handling & Execution Platform" />
        </Section>
        <Section title="Roles & Users">
          <table className="w-full text-[13px]">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left font-medium pb-2">Name</th><th className="text-left font-medium pb-2">Email</th><th className="text-left font-medium pb-2">Role</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border/60">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2 text-muted-foreground">{u.email}</td>
                  <td className="py-2"><span className="rounded-sm border border-border bg-muted/40 px-1.5 py-0.5 text-[11px]">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </AppShell>
  );
}
