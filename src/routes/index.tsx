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
        <h1 className="text-5xl sm:text-5xl font-display">Let's plan your event.</h1>
      </header>
      <IntakeWizard />
      <Toaster richColors position="top-center" />
    </main>
  );
}
