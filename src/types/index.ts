// ===== INTERFACES =====
export interface Applicant {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
  createdAt: string;
}

export interface Internship {
  id: string;
  company: string;
  position: string;
  location: string;
  availableSlots: number;
  createdAt: string;
}

export interface InternshipRecommendation extends Internship {
  reason: string;
}

export interface Application {
  id: string;
  applicantId: string;
  internshipId: string;
  status: string;
  createdAt: string;
}

export type ApiApplication = Application;

export interface ApiUser {
  id: string;
  email: string;
}

export interface AuthReply {
  token: string;
  user: ApiUser;
}

// ===== API TYPES =====
export type ApplicantCreateInput = Omit<Applicant, "id" | "createdAt">;

export type InternshipCreateInput = Omit<Internship, "id" | "createdAt">;

export type ApplicationCreateInput = Pick<
  Application,
  "applicantId" | "internshipId"
>;

// ===== UTILITY TYPES =====
export type ApplicantUpdate = Partial<Applicant>;
export type ApplicantPreview = Pick<Applicant, "id" | "name" | "role">;
export type PublicApplicant = Omit<Applicant, "email" | "isActive">;

export type StatusLabels = Record<string, string>;

// ===== ENUM =====
export const ApplicationStatus = {
  Pending: "Pending",
  UnderReview: "Under Review",
  InterviewScheduled: "Interview Scheduled",
  Accepted: "Accepted",
  Rejected: "Rejected",
} as const;

export const Role = {
  Student: "student",
  Admin: "admin",
  Instructor: "instructor",
} as const;

// ===== GENERIC INTERFACE =====
export interface ApiHealth {
  ok: boolean;
  db: boolean;
}