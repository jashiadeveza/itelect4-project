import type { Applicant, Internship, Application, ApiResponse } from "../types/index";
import { ApplicationStatus, StatusLabels } from "../types/index";

// ===== ENUM -> LABEL MAP (uses Record utility type) =====
const statusLabels: StatusLabels = {
  [ApplicationStatus.Pending]: "Pending",
  [ApplicationStatus.UnderReview]: "Under Review",
  [ApplicationStatus.InterviewScheduled]: "Interview Scheduled",
  [ApplicationStatus.Accepted]: "Accepted",
  [ApplicationStatus.Rejected]: "Rejected",
};

console.log("==========================================");
console.log("     INTERNSHIP APPLICATION TRACKER");
console.log("==========================================");

// ===== APPLICANTS =====
const applicants: Applicant[] = [
  {
    id: 1,
    name: "Jashia Deveza",
    email: "jashia@example.com",
    role: "student",
    isActive: true,
  },
  {
    id: 2,
    name: "Giann Villasenor",
    email: "giann@example.com",
    role: "student",
    isActive: true,
  },
];

console.log("APPLICANTS");
console.log(JSON.stringify(applicants, null, 2));

// ===== INTERNSHIPS =====
const internships: Internship[] = [
  {
    id: 1,
    company: "Accenture",
    position: "Software Developer Intern",
    location: "Taguig City",
    availableSlots: 5,
  },
  {
    id: 2,
    company: "IBM",
    position: "QA Tester Intern",
    location: "Quezon City",
    availableSlots: 2,
  },
];

console.log("INTERNSHIPS");
console.log(JSON.stringify(internships, null, 2));

// ===== APPLICATIONS =====
const applications: Application[] = [
  {
    id: 101,
    applicantId: 1,
    internshipId: 1,
    status: statusLabels[ApplicationStatus.UnderReview],
  },
  {
    id: 102,
    applicantId: 2,
    internshipId: 2,
    status: statusLabels[ApplicationStatus.InterviewScheduled],
  },
];

console.log("APPLICATIONS");
console.log(JSON.stringify(applications, null, 2));

// ===== GENERIC FUNCTION (getById) =====
function getById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id);
}

// ===== API RESPONSE WRAPPER (generic interface usage) =====
const applicantsResponse: ApiResponse<Applicant[]> = {
  success: true,
  data: applicants,
};

// ===== APPLICATION STATUS =====
console.log("APPLICATION STATUS");

applications.forEach((app) => {
  const applicant = getById<Applicant>(applicantsResponse.data, app.applicantId);
  const internship = getById<Internship>(internships, app.internshipId);

  console.log(`Application ID: #${app.id}`);
  console.log(`Applicant: ${applicant?.name}`);
  console.log(`Company: ${internship?.company}`);
  console.log(`Status: ${app.status}`);
});