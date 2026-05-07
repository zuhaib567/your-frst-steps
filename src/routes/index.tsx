import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { IntakeWizard } from "@/components/intake/IntakeWizard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Event Intake — Onboarding" },
      { name: "description", content: "A short, guided intake form for event requests." },
    ],
  }),
});

function Index() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Core Intake · V1
        </div>
        <h1 className="text-5xl sm:text-6xl">Let's plan your event.</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          A short, focused intake — about 3 to 5 minutes. We'll walk through it one section at a time.
        </p>
      </header>
      <IntakeWizard />
      <Toaster richColors position="top-center" />
    </main>
  );
}
