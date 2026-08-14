import type { Applicant, Internship } from "./types";

export const applicants: Applicant[] = [
  { id: 1, name: "Jashia Deveza", email: "jashia@gmail.com", role: "student", isActive: true },
  { id: 2, name: "Giann Villasenor", email: "giann@gmail.com", role: "student", isActive: true },
];

export const internships: Internship[] = [
  { id: 1, company: "Accenture", position: "Software Developer Intern", location: "Taguig City", availableSlots: 5 },
  { id: 2, company: "IBM", position: "QA Tester Intern", location: "Quezon City", availableSlots: 2 },
];

export default { applicants, internships };
