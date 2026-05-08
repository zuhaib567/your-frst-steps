export type LocationType = "in-person" | "virtual" | "hybrid";
export type Complexity = "low" | "medium" | "high";
export type SupportArea = "AV" | "Culinary" | "Marketing" | "IT" | "Facilities";

export interface IntakeFormData {
  // Requestor
  ministry: string;
  contactName: string;
  email: string;
  phone: string;
  // Event Core
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  locationType: LocationType | "";
  locationDetails: string;
  // Scope Signals
  attendance: string;
  budget: string;
  eventType: string;
  // Support
  support: SupportArea[];
  av: { stream: boolean; presentation: boolean; complexity: Complexity | "" };
  culinary: { meal: boolean; guests: string };
  marketing: { assets: string; deadline: string };
  it: { registration: boolean; checkIn: boolean };
  // Description
  description: string;
}

export const initialData: IntakeFormData = {
  ministry: "",
  contactName: "",
  email: "",
  phone: "",
  eventName: "",
  date: "",
  startTime: "",
  endTime: "",
  locationType: "",
  locationDetails: "",
  attendance: "",
  budget: "",
  eventType: "",
  support: [],
  av: { stream: false, presentation: false, complexity: "" },
  culinary: { meal: false, guests: "" },
  marketing: { assets: "", deadline: "" },
  it: { registration: false, checkIn: false },
  description: "",
};
