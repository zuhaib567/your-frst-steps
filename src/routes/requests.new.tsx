import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/shepherd/AppShell";
import { useShepherd } from "@/lib/shepherd/store";
import { useState } from "react";
import type { Priority } from "@/lib/shepherd/types";

export const Route = createFileRoute("/requests/new")({
  component: NewRequest,
});

function NewRequest() {
  const nav = useNavigate();
  const { departments, addRequest } = useShepherd();
  const [form, setForm] = useState({
    summary: "",
    details: "",
    priority: "Normal" as Priority,
    requestingDept: "",
    requestedDepts: [] as string[],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addRequest(form);
    nav({ to: "/requests/$id", params: { id } });
  };

  const inputCls = "w-full rounded-sm border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-primary/60";
  const labelCls = "text-[11px] uppercase tracking-wider text-muted-foreground";

  return (
    <AppShell title="New Request">
      <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-md border border-border bg-card p-6">
        <div>
          <label className={labelCls}>Summary</label>
          <input required value={form.summary} onChange={(e) => set("summary", e.target.value)} className={inputCls + " mt-1"} placeholder="One-line description" />
        </div>
        <div>
          <label className={labelCls}>Details</label>
          <textarea required value={form.details} onChange={(e) => set("details", e.target.value)} rows={4} className={inputCls + " mt-1 resize-none"} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Priority</label>
            <select value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)} className={inputCls + " mt-1"}>
              {["Low", "Normal", "High", "Critical"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Requesting Department</label>
            <input required value={form.requestingDept} onChange={(e) => set("requestingDept", e.target.value)} className={inputCls + " mt-1"} placeholder="e.g. People Ops" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Requested Departments</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {departments.map((d) => {
              const on = form.requestedDepts.includes(d.id);
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => set("requestedDepts", on ? form.requestedDepts.filter((x) => x !== d.id) : [...form.requestedDepts, d.id])}
                  className={`rounded-sm border px-2.5 py-1 text-[12px] ${on ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Contact Name</label>
            <input required value={form.contactName} onChange={(e) => set("contactName", e.target.value)} className={inputCls + " mt-1"} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input required type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputCls + " mt-1"} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inputCls + " mt-1"} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button type="button" onClick={() => nav({ to: "/requests" })} className="rounded-sm border border-border px-3 py-1.5 text-[12px] hover:bg-accent">Cancel</button>
          <button type="submit" className="rounded-sm bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Submit Request</button>
        </div>
      </form>
    </AppShell>
  );
}
