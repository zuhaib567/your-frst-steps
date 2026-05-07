import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  CheckSquare,
  Building2,
  AlertTriangle,
  ScrollText,
  FileCode2,
  Settings,
  Shield,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { useShepherd } from "@/lib/shepherd/store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/requests", label: "Requests", icon: Inbox },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/escalations", label: "Escalations", icon: AlertTriangle },
  { to: "/audit", label: "Audit Log", icon: ScrollText },
  { to: "/templates", label: "Templates", icon: FileCode2 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title, actions }: { children: ReactNode; title: string; actions?: ReactNode }) {
  const loc = useLocation();
  const user = useShepherd((s) => s.currentUser);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-primary">
            <Shield className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">SHEPHERD</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Ops Control</div>
          </div>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? loc.pathname === "/"
                : loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3 text-[11px] text-muted-foreground font-mono">
          v1.0 · MVP
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
          <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground w-72">
              <Search className="h-3.5 w-3.5" />
              <input
                placeholder="Search requests, departments…"
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
              <kbd className="font-mono text-[10px] text-muted-foreground/70">⌘K</kbd>
            </div>
            {actions}
            <div className="flex items-center gap-2 rounded-sm border border-border bg-card pl-1 pr-2.5 py-1">
              <div className="h-6 w-6 rounded-sm bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="leading-tight">
                <div className="text-[12px] font-medium">{user.name}</div>
                <div className="text-[10px] text-muted-foreground">{user.role}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
