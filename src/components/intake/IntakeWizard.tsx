import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { initialData, type IntakeFormData, type SupportArea } from "./types";
import { toast } from "sonner";

const SUPPORT_AREAS: SupportArea[] = ["AV", "Culinary", "Marketing", "IT", "Facilities"];

const STEPS = [
  { id: "requestor", title: "Requestor", subtitle: "Tell us who's organizing" },
  { id: "event", title: "Event Core", subtitle: "The essential details" },
  { id: "scope", title: "Scope Signals", subtitle: "Help us size the request" },
  { id: "support", title: "Support Needed", subtitle: "Which teams should we loop in?" },
  { id: "details", title: "Conditional Details", subtitle: "A few quick follow-ups" },
  { id: "description", title: "Description", subtitle: "Bring it together" },
  { id: "review", title: "Review & Submit", subtitle: "Confirm everything looks right" },
] as const;

export function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeFormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const hasConditional = data.support.some((s) =>
    ["AV", "Culinary", "Marketing", "IT"].includes(s),
  );
  const visibleSteps = useMemo(
    () => STEPS.filter((s) => s.id !== "details" || hasConditional),
    [hasConditional],
  );
  const current = visibleSteps[step];
  const progress = ((step + 1) / visibleSteps.length) * 100;

  const canAdvance = (): boolean => {
    switch (current.id) {
      case "requestor":
        return !!(data.ministry && data.contactName && data.email);
      case "event":
        return !!(
          data.eventName &&
          data.date &&
          data.startTime &&
          data.endTime &&
          data.locationType
        );
      case "scope":
        return !!(data.attendance && data.budget && data.eventType);
      case "support":
        return data.support.length > 0;
      case "description":
        return data.description.trim().length >= 10;
      default:
        return true;
    }
  };

  const next = () => {
    if (!canAdvance()) {
      toast.error("Please complete the required fields");
      return;
    }
    setStep((s) => Math.min(s + 1, visibleSteps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    setSubmitted(true);
    toast.success("Intake submitted for approval");
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card p-12 text-center shadow-[var(--shadow-card)]"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-3xl">Submitted for review</h2>
        <p className="text-muted-foreground">
          Your request for <span className="font-medium text-foreground">{data.eventName}</span> has
          been sent to the approval queue.
        </p>
        <Button
          className="mt-8"
          variant="outline"
          onClick={() => {
            setData(initialData);
            setStep(0);
            setSubmitted(false);
          }}
        >
          Submit another request
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-[var(--shadow-card)]">
      {/* Progress header */}
      <div className="border-b p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Step {step + 1} of {visibleSteps.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="mt-6">
          <h2 className="text-3xl sm:text-4xl">{current.title}</h2>
          <p className="mt-1 text-muted-foreground">{current.subtitle}</p>
        </div>
      </div>

      {/* Step body */}
      <div className="min-h-[360px] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {current.id === "requestor" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Ministry / Group" required>
                  <Input
                    value={data.ministry}
                    onChange={(e) => update("ministry", e.target.value)}
                    placeholder="e.g. Worship Arts"
                  />
                </Field>
                <Field label="Contact Name" required>
                  <Input
                    value={data.contactName}
                    onChange={(e) => update("contactName", e.target.value)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="jane@church.org"
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </Field>
              </div>
            )}

            {current.id === "event" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Event Name" required className="sm:col-span-2">
                  <Input
                    value={data.eventName}
                    onChange={(e) => update("eventName", e.target.value)}
                    placeholder="Spring Outreach Night"
                  />
                </Field>
                <Field label="Date" required>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => update("date", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Time" required>
                    <Input
                      type="time"
                      value={data.startTime}
                      onChange={(e) => update("startTime", e.target.value)}
                    />
                  </Field>
                  <Field label="End Time" required>
                    <Input
                      type="time"
                      value={data.endTime}
                      onChange={(e) => update("endTime", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Location Type" required className="sm:col-span-2">
                  <RadioGroup
                    value={data.locationType}
                    onValueChange={(v) =>
                      update("locationType", v as IntakeFormData["locationType"])
                    }
                    className="grid grid-cols-3 gap-3"
                  >
                    {(["in-person", "virtual", "hybrid"] as const).map((t) => (
                      <label
                        key={t}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 capitalize transition hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <RadioGroupItem value={t} />
                        <span className="text-sm font-medium">{t.replace("-", " ")}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </Field>
                <Field label="Location Details" className="sm:col-span-2">
                  <Input
                    value={data.locationDetails}
                    onChange={(e) => update("locationDetails", e.target.value)}
                    placeholder="Room name, address, or platform link"
                  />
                </Field>
              </div>
            )}

            {current.id === "scope" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Estimated Attendance" required>
                  <Select value={data.attendance} onValueChange={(v) => update("attendance", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a range" />
                    </SelectTrigger>
                    <SelectContent>
                      {["< 25", "25–75", "75–200", "200–500", "500+"].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Budget Range" required>
                  <Select value={data.budget} onValueChange={(v) => update("budget", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a range" />
                    </SelectTrigger>
                    <SelectContent>
                      {["< $500", "$500–$2K", "$2K–$10K", "$10K–$25K", "$25K+"].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Event Type" required className="sm:col-span-2">
                  <Select value={data.eventType} onValueChange={(v) => update("eventType", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Worship",
                        "Outreach",
                        "Conference",
                        "Fundraiser",
                        "Training",
                        "Social",
                        "Other",
                      ].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {current.id === "support" && (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">Select every team you'll need.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUPPORT_AREAS.map((area) => {
                    const checked = data.support.includes(area);
                    return (
                      <label
                        key={area}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-4 transition hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            update(
                              "support",
                              v ? [...data.support, area] : data.support.filter((s) => s !== area),
                            );
                          }}
                        />
                        <span className="font-medium">{area}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {current.id === "details" && (
              <div className="space-y-6">
                {data.support.includes("AV") && (
                  <ConditionalCard title="AV">
                    <ToggleRow
                      label="Stream / record?"
                      value={data.av.stream}
                      onChange={(v) => update("av", { ...data.av, stream: v })}
                    />
                    <ToggleRow
                      label="Presentation needed?"
                      value={data.av.presentation}
                      onChange={(v) => update("av", { ...data.av, presentation: v })}
                    />
                    <Field label="Complexity">
                      <Select
                        value={data.av.complexity}
                        onValueChange={(v) => update("av", { ...data.av, complexity: v as never })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </ConditionalCard>
                )}
                {data.support.includes("Culinary") && (
                  <ConditionalCard title="Culinary">
                    <ToggleRow
                      label="Meal needed?"
                      value={data.culinary.meal}
                      onChange={(v) => update("culinary", { ...data.culinary, meal: v })}
                    />
                    <Field label="Guest estimate">
                      <Input
                        type="number"
                        value={data.culinary.guests}
                        onChange={(e) =>
                          update("culinary", { ...data.culinary, guests: e.target.value })
                        }
                        placeholder="e.g. 80"
                      />
                    </Field>
                  </ConditionalCard>
                )}
                {data.support.includes("Marketing") && (
                  <ConditionalCard title="Marketing">
                    <Field label="Assets needed">
                      <Input
                        value={data.marketing.assets}
                        onChange={(e) =>
                          update("marketing", { ...data.marketing, assets: e.target.value })
                        }
                        placeholder="Flyer, social, web banner…"
                      />
                    </Field>
                    <Field label="Deadline">
                      <Input
                        type="date"
                        value={data.marketing.deadline}
                        onChange={(e) =>
                          update("marketing", { ...data.marketing, deadline: e.target.value })
                        }
                      />
                    </Field>
                  </ConditionalCard>
                )}
                {data.support.includes("IT") && (
                  <ConditionalCard title="IT">
                    <ToggleRow
                      label="Registration needed?"
                      value={data.it.registration}
                      onChange={(v) => update("it", { ...data.it, registration: v })}
                    />
                    <ToggleRow
                      label="Check-in needed?"
                      value={data.it.checkIn}
                      onChange={(v) => update("it", { ...data.it, checkIn: v })}
                    />
                  </ConditionalCard>
                )}
              </div>
            )}

            {current.id === "description" && (
              <Field label="Short description" required>
                <Textarea
                  rows={6}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="3–4 sentences describing the event, audience, and goal."
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {data.description.length} characters
                </p>
              </Field>
            )}

            {current.id === "review" && (
              <div className="space-y-6">
                <ReviewSection
                  title="Requestor"
                  rows={[
                    ["Ministry", data.ministry],
                    ["Contact", data.contactName],
                    ["Email", data.email],
                    ["Phone", data.phone || "—"],
                  ]}
                />
                <ReviewSection
                  title="Event"
                  rows={[
                    ["Name", data.eventName],
                    ["Date", data.date],
                    ["Time", `${data.startTime} – ${data.endTime}`],
                    [
                      "Location",
                      `${data.locationType}${data.locationDetails ? ` · ${data.locationDetails}` : ""}`,
                    ],
                  ]}
                />
                <ReviewSection
                  title="Scope"
                  rows={[
                    ["Attendance", data.attendance],
                    ["Budget", data.budget],
                    ["Type", data.eventType],
                  ]}
                />
                <div>
                  <h3 className="mb-2 text-lg">Support Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.support.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ReviewSection title="Description" rows={[["", data.description]]} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t bg-muted/30 p-6">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="hidden gap-1.5 sm:flex">
          {visibleSteps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 w-6 rounded-full transition ${
                i < step ? "bg-primary" : i === step ? "bg-primary/70" : "bg-border"
              }`}
            />
          ))}
        </div>
        {step === visibleSteps.length - 1 ? (
          <Button onClick={submit}>
            <Check className="mr-2 h-4 w-4" /> Submit
          </Button>
        ) : (
          <Button onClick={next}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 inline-block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background p-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function ConditionalCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-background/50 p-5">
      <h3 className="mb-4 text-xl">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ReviewSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-2 text-lg">{title}</h3>
      <dl className="divide-y rounded-lg border bg-background">
        {rows.map(([k, v], i) => (
          <div key={i} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
            {k && <dt className="text-muted-foreground">{k}</dt>}
            <dd className={k ? "col-span-2" : "col-span-3"}>{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
