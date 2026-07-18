// ===== INTERFACES =====
export interface Applicant {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export interface Internship {
  id: number;
  company: string;
  position: string;
  location: string;
  availableSlots: number;
}

export interface Application {
  id: number;
  applicantId: number;
  internshipId: number;
  status: string;
}

// ===== UTILITY TYPES =====
// Partial<T>
export type ApplicantUpdate = Partial<Applicant>;
// Pick<T, K>
export type ApplicantPreview = Pick<Applicant, "id" | "name" | "role">;
// Omit<T, K>
export type PublicApplicant = Omit<Applicant, "email" | "isActive">;
// Record<K, T>
export type StatusLabels = Record<ApplicationStatus, string>;

// ===== ENUM =====
export enum ApplicationStatus {
  Pending,
  UnderReview,
  InterviewScheduled,
  Accepted,
  Rejected,
}

export const enum Role {
  Student = "student",
  Admin = "admin",
  Instructor = "instructor",
}

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}