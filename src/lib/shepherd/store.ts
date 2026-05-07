import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  Approval,
  Assignment,
  AuditEntry,
  Department,
  Escalation,
  RequestRecord,
  Stage,
  TemplateRecord,
  User,
} from "./types";

const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const departments: Department[] = [
  { id: "d-it", name: "IT", email: "it@org.local", owner: "Priya Shah", reminderHours: 24 },
  { id: "d-fac", name: "Facilities", email: "facilities@org.local", owner: "Marcus Hill", reminderHours: 24 },
  { id: "d-av", name: "AV", email: "av@org.local", owner: "Tomás Ruiz", reminderHours: 12 },
  { id: "d-cul", name: "Culinary", email: "culinary@org.local", owner: "Hana Park", reminderHours: 24 },
  { id: "d-mkt", name: "Marketing", email: "mkt@org.local", owner: "Eli Brooks", reminderHours: 48 },
  { id: "d-sec", name: "Security", email: "sec@org.local", owner: "J. Okafor", reminderHours: 12 },
];

const users: User[] = [
  { id: "u1", name: "Avery Lin", email: "avery@org.local", role: "System Admin" },
  { id: "u2", name: "Dana Wells", email: "dana@org.local", role: "Coordinator" },
  { id: "u3", name: "Sam Kim", email: "sam@org.local", role: "Approver" },
  { id: "u4", name: "Riya Patel", email: "riya@org.local", role: "Read Only" },
];

const requests: RequestRecord[] = [
  {
    id: "REQ-1042",
    summary: "Quarterly all-hands logistics",
    details: "Need AV setup, catering for 220, security check-in, and lobby signage for Q2 all-hands.",
    priority: "High",
    requestingDept: "Executive Office",
    requestedDepts: ["d-av", "d-cul", "d-fac", "d-sec"],
    contactName: "Lena Cho",
    contactEmail: "lena@org.local",
    contactPhone: "555-0142",
    currentStage: "In Progress",
    stageStatus: "active",
    stageStartedOn: daysAgo(2),
    createdOn: daysAgo(6),
  },
  {
    id: "REQ-1041",
    summary: "New hire laptop provisioning — Eng cohort",
    details: "12 MacBooks, standard imaging, delivery to floor 4 by Monday.",
    priority: "Normal",
    requestingDept: "People Ops",
    requestedDepts: ["d-it"],
    contactName: "Jordan May",
    contactEmail: "jordan@org.local",
    contactPhone: "555-0188",
    currentStage: "Under Review",
    stageStatus: "active",
    stageStartedOn: daysAgo(1),
    createdOn: daysAgo(1),
  },
  {
    id: "REQ-1040",
    summary: "Press briefing — product launch",
    details: "Press room, livestream AV, refreshments, branded backdrop.",
    priority: "Critical",
    requestingDept: "Marketing",
    requestedDepts: ["d-av", "d-mkt", "d-cul"],
    contactName: "Eli Brooks",
    contactEmail: "eli@org.local",
    contactPhone: "555-0101",
    currentStage: "Assigned",
    stageStatus: "blocked",
    stageStartedOn: daysAgo(4),
    createdOn: daysAgo(7),
  },
  {
    id: "REQ-1039",
    summary: "Lobby HVAC repair",
    details: "Intermittent failure in zone 2. Flagged by night security.",
    priority: "High",
    requestingDept: "Facilities",
    requestedDepts: ["d-fac"],
    contactName: "Marcus Hill",
    contactEmail: "marcus@org.local",
    contactPhone: "555-0167",
    currentStage: "Completed",
    stageStatus: "complete",
    stageStartedOn: daysAgo(8),
    stageCompletedOn: daysAgo(1),
    createdOn: daysAgo(10),
  },
  {
    id: "REQ-1038",
    summary: "Vendor onboarding — Acme Catering",
    details: "Insurance docs, COI, system access for portal.",
    priority: "Low",
    requestingDept: "Procurement",
    requestedDepts: ["d-it", "d-cul"],
    contactName: "Sam Kim",
    contactEmail: "sam@org.local",
    contactPhone: "555-0119",
    currentStage: "Closed",
    stageStatus: "complete",
    stageStartedOn: daysAgo(15),
    stageCompletedOn: daysAgo(12),
    createdOn: daysAgo(20),
    closedOn: daysAgo(11),
  },
];

const assignments: Assignment[] = [
  { id: "a1", requestId: "REQ-1042", departmentId: "d-av", status: "Accepted", sentOn: daysAgo(5), respondedOn: daysAgo(4) },
  { id: "a2", requestId: "REQ-1042", departmentId: "d-cul", status: "Accepted", sentOn: daysAgo(5), respondedOn: daysAgo(4) },
  { id: "a3", requestId: "REQ-1042", departmentId: "d-fac", status: "Pending", sentOn: daysAgo(5) },
  { id: "a4", requestId: "REQ-1042", departmentId: "d-sec", status: "Viewed", sentOn: daysAgo(5) },
  { id: "a5", requestId: "REQ-1040", departmentId: "d-av", status: "Escalated", sentOn: daysAgo(6) },
  { id: "a6", requestId: "REQ-1040", departmentId: "d-mkt", status: "Accepted", sentOn: daysAgo(6), respondedOn: daysAgo(5) },
  { id: "a7", requestId: "REQ-1040", departmentId: "d-cul", status: "Denied", sentOn: daysAgo(6), respondedOn: daysAgo(4), note: "No availability for date." },
  { id: "a8", requestId: "REQ-1039", departmentId: "d-fac", status: "Completed", sentOn: daysAgo(9), respondedOn: daysAgo(1) },
  { id: "a9", requestId: "REQ-1038", departmentId: "d-it", status: "Completed", sentOn: daysAgo(19), respondedOn: daysAgo(13) },
  { id: "a10", requestId: "REQ-1038", departmentId: "d-cul", status: "Completed", sentOn: daysAgo(19), respondedOn: daysAgo(14) },
];

const approvals: Approval[] = [
  { id: "ap1", requestId: "REQ-1042", approver: "Sam Kim", state: "Approved", decidedOn: daysAgo(5), comment: "Approved with standard budget." },
  { id: "ap2", requestId: "REQ-1041", approver: "Sam Kim", state: "Pending" },
  { id: "ap3", requestId: "REQ-1040", approver: "Sam Kim", state: "Approved", decidedOn: daysAgo(6) },
  { id: "ap4", requestId: "REQ-1039", approver: "Dana Wells", state: "Approved", decidedOn: daysAgo(9) },
  { id: "ap5", requestId: "REQ-1038", approver: "Sam Kim", state: "Approved", decidedOn: daysAgo(19) },
];

const escalations: Escalation[] = [
  { id: "e1", requestId: "REQ-1040", reason: "AV department non-responsive past 48h threshold", createdOn: daysAgo(1), resolved: false },
  { id: "e2", requestId: "REQ-1042", reason: "Facilities pending past reminder cadence", createdOn: daysAgo(1), resolved: false },
];

const audit: AuditEntry[] = [
  { id: nanoid(), requestId: "REQ-1042", actor: "Lena Cho", action: "Request submitted", ts: daysAgo(6) },
  { id: nanoid(), requestId: "REQ-1042", actor: "Sam Kim", action: "Approval granted", ts: daysAgo(5) },
  { id: nanoid(), requestId: "REQ-1042", actor: "system", action: "Assignments dispatched", detail: "AV, Culinary, Facilities, Security", ts: daysAgo(5) },
  { id: nanoid(), requestId: "REQ-1042", actor: "AV", action: "Assignment accepted", ts: daysAgo(4) },
  { id: nanoid(), requestId: "REQ-1040", actor: "system", action: "Escalation triggered", detail: "AV non-response > 48h", ts: daysAgo(1) },
  { id: nanoid(), requestId: "REQ-1041", actor: "Jordan May", action: "Request submitted", ts: daysAgo(1) },
  { id: nanoid(), requestId: "REQ-1039", actor: "Facilities", action: "Marked complete", ts: daysAgo(1) },
];

const templates: TemplateRecord[] = [
  { id: "t1", type: "Approval", name: "Approval request", subject: "Approval needed: {{RequestID}}", body: "Hello,\n\n{{RequestSummary}} requires your approval.\n\nReview: {{AcceptLink}}" },
  { id: "t2", type: "Assignment", name: "Assignment notification", subject: "New assignment for {{DepartmentName}} — {{RequestID}}", body: "{{DepartmentName}} team,\n\nA new request has been routed to you.\n\nAccept: {{AcceptLink}}\nDeny: {{DenyLink}}" },
  { id: "t3", type: "Reminder", name: "Reminder", subject: "Reminder: {{RequestID}} awaiting response", body: "This is a reminder that {{RequestID}} ({{RequestSummary}}) is still awaiting your response." },
  { id: "t4", type: "Escalation", name: "Escalation notice", subject: "Escalated: {{RequestID}}", body: "{{RequestID}} has been escalated due to inactivity past threshold." },
  { id: "t5", type: "Completion", name: "Completion notice", subject: "Completed: {{RequestID}}", body: "All assignments for {{RequestID}} have been completed." },
];

interface ShepherdState {
  users: User[];
  departments: Department[];
  requests: RequestRecord[];
  assignments: Assignment[];
  approvals: Approval[];
  escalations: Escalation[];
  audit: AuditEntry[];
  templates: TemplateRecord[];
  currentUser: User;
  addRequest: (r: Omit<RequestRecord, "id" | "currentStage" | "stageStatus" | "stageStartedOn" | "createdOn">) => string;
  decideApproval: (requestId: string, state: "Approved" | "Denied", comment?: string) => void;
  setAssignmentStatus: (assignmentId: string, status: Assignment["status"], note?: string) => void;
  advanceStage: (requestId: string, to: Stage) => void;
  log: (entry: Omit<AuditEntry, "id" | "ts">) => void;
}

export const useShepherd = create<ShepherdState>((set, get) => ({
  users,
  departments,
  requests,
  assignments,
  approvals,
  escalations,
  audit,
  templates,
  currentUser: users[1],
  addRequest: (r) => {
    const id = `REQ-${1043 + get().requests.length - 5}`;
    const rec: RequestRecord = {
      ...r,
      id,
      currentStage: "Submitted",
      stageStatus: "active",
      stageStartedOn: now(),
      createdOn: now(),
    };
    set((s) => ({
      requests: [rec, ...s.requests],
      approvals: [...s.approvals, { id: nanoid(), requestId: id, approver: "Sam Kim", state: "Pending" }],
      audit: [{ id: nanoid(), requestId: id, actor: get().currentUser.name, action: "Request submitted", ts: now() }, ...s.audit],
    }));
    return id;
  },
  decideApproval: (requestId, state, comment) => {
    set((s) => ({
      approvals: s.approvals.map((a) =>
        a.requestId === requestId && a.state === "Pending"
          ? { ...a, state, comment, decidedOn: now() }
          : a
      ),
      requests: s.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              currentStage: state === "Approved" ? "Approved" : "Closed",
              stageStatus: "active",
              stageStartedOn: now(),
              closedOn: state === "Denied" ? now() : r.closedOn,
            }
          : r
      ),
      audit: [
        { id: nanoid(), requestId, actor: get().currentUser.name, action: state === "Approved" ? "Approval granted" : "Approval denied", detail: comment, ts: now() },
        ...s.audit,
      ],
    }));
  },
  setAssignmentStatus: (assignmentId, status, note) => {
    set((s) => ({
      assignments: s.assignments.map((a) =>
        a.id === assignmentId ? { ...a, status, note, respondedOn: now() } : a
      ),
      audit: [
        { id: nanoid(), requestId: s.assignments.find((x) => x.id === assignmentId)?.requestId, actor: get().currentUser.name, action: `Assignment marked ${status}`, detail: note, ts: now() },
        ...s.audit,
      ],
    }));
  },
  advanceStage: (requestId, to) => {
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === requestId ? { ...r, currentStage: to, stageStartedOn: now(), stageStatus: "active" } : r
      ),
      audit: [
        { id: nanoid(), requestId, actor: get().currentUser.name, action: `Stage → ${to}`, ts: now() },
        ...s.audit,
      ],
    }));
  },
  log: (entry) =>
    set((s) => ({ audit: [{ ...entry, id: nanoid(), ts: now() }, ...s.audit] })),
}));

export const stageColor = (s: Stage) => {
  switch (s) {
    case "Submitted": return "text-muted-foreground";
    case "Under Review": return "text-info";
    case "Approved": return "text-info";
    case "Assigned": return "text-info";
    case "In Progress": return "text-warning";
    case "Completed": return "text-success";
    case "Closed": return "text-muted-foreground";
  }
};
