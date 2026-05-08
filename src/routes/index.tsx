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
        <h1 className="text-5xl sm:text-5xl">Let's plan your event.</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
          A short, focused intake — about 3 to 5 minutes. We'll walk through it one section at a
          time.
        </p>
      </header>
      <IntakeWizard />
      <Toaster richColors position="top-center" />
    </main>
  );
}
