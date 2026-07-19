import React, { useState } from "react";
import "./App.css";
import ApplicantCard from "./components/ApplicantCard";
import InternshipCard from "./components/InternshipCard";
import ApplicationCard from "./components/ApplicationCard";

import type { Applicant, Internship, Application } from "./types";

const initialApplicants: Applicant[] = [
  {
    id: 1,
    name: "Jashia Deveza",
    email: "jashia@gmail.com",
    role: "student",
    isActive: true,
  },
  {
    id: 2,
    name: "Giann Villasenor",
    email: "giann@gmail.com",
    role: "student",
    isActive: true,
  },
];

// internships and applications are provided below as initial state
const initialInternships: Internship[] = [
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

const initialApplications: Application[] = [
  {
    id: 101,
    applicantId: 1,
    internshipId: 1,
    status: "Under Review",
  },
  {
    id: 102,
    applicantId: 2,
    internshipId: 2,
    status: "Interview Scheduled",
  },
];

function App() {
  const [applicants] = useState<Applicant[]>(initialApplicants);
  const [internships] = useState<Internship[]>(initialInternships);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const handleContact = (internship: Internship) => {
    alert(`Contacting host for ${internship.company} (${internship.position})`);
  };

  const handleUpdateStatus = (application: Application, status: string) => {
    setApplications((prev) => prev.map((a) => (a.id === application.id ? { ...a, status } : a)));
  };

  const handleSelectApplicant = (applicant: Applicant) => {
    alert(`Selected: ${applicant.name} (${applicant.role})`);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Internship Application Tracker</h1>
        <h3>Jashia Deveza IT4B</h3>
      </div>

      <div className="card-grid">
        {applicants.map((applicant) => {
          const internship = internships.find((item) => item.id === applicant.id);
          const application = applications.find((item) => item.applicantId === applicant.id);

          return (
            <div key={applicant.id} className="combined-card">
              <ApplicantCard
                applicant={applicant}
                onSelect={handleSelectApplicant}
              />

              {internship && <InternshipCard internship={internship} onContact={handleContact} />}

              {application && (
                <ApplicationCard application={application} onUpdateStatus={handleUpdateStatus}>
                  <p className="status-message">Current Status: {application.status}</p>
                </ApplicationCard>
              )}
            </div>
          );
        })}
      </div>

      <div className="footer">GT 2 Part 1</div>
    </div>
  );
}

export default App;