import type { Applicant, Internship, Application, ApiResponse } from "./types";

function getUser(id: number): Applicant {
  return {
    id,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
  };
}

function formatInternship(name: string, units: number, semester: string): string {
  const internship: Internship = {
    id: units,
    company: name,
    position: semester,
    location: "Taguig City",
    availableSlots: 5,
  };

  return `${internship.company} - ${internship.position}`;
}

const user: Applicant = getUser(1);

const response: ApiResponse<Application[]> = {
  success: true,
  data: [
    {
      id: 1,
      applicantId: user.id,
      internshipId: 2,
      status: "Under Review",
    },
  ],
};

console.log(user);
console.log(response.success);
console.log(formatInternship("Accenture", 3, "Software Developer Intern"));