export type Stage =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Closed";

export const STAGES: Stage[] = [
  "Submitted",
  "Under Review",
  "Approved",
  "Assigned",
  "In Progress",
  "Completed",
  "Closed",
];

export type Priority = "Low" | "Normal" | "High" | "Critical";
export type StageStatus = "active" | "complete" | "blocked";

export type AssignmentStatus =
  | "Pending"
  | "Viewed"
  | "Accepted"
  | "Denied"
  | "Completed"
  | "Escalated";

export type ApprovalState = "Pending" | "Approved" | "Denied";

export interface Department {
  id: string;
  name: string;
  email: string;
  owner: string;
  reminderHours: number;
}

export interface Assignment {
  id: string;
  requestId: string;
  departmentId: string;
  status: AssignmentStatus;
  sentOn: string;
  respondedOn?: string;
  note?: string;
}

export interface Approval {
  id: string;
  requestId: string;
  approver: string;
  state: ApprovalState;
  comment?: string;
  decidedOn?: string;
}

export interface Escalation {
  id: string;
  requestId: string;
  reason: string;
  createdOn: string;
  resolved: boolean;
}

export interface AuditEntry {
  id: string;
  requestId?: string;
  actor: string;
  action: string;
  detail?: string;
  ts: string;
}

export interface RequestRecord {
  id: string;
  summary: string;
  details: string;
  priority: Priority;
  requestingDept: string;
  requestedDepts: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  currentStage: Stage;
  stageStatus: StageStatus;
  stageStartedOn: string;
  stageCompletedOn?: string;
  createdOn: string;
  closedOn?: string;
}

export interface TemplateRecord {
  id: string;
  type: "Approval" | "Assignment" | "Reminder" | "Escalation" | "Completion";
  name: string;
  subject: string;
  body: string;
}

export type Role = "System Admin" | "Coordinator" | "Approver" | "Department User" | "Read Only";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
