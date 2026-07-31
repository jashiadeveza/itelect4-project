import { useEffect, useRef, useState, type ChangeEvent } from "react";
import "./App.css";
import ApplicantCard from "./components/ApplicantCard";
import InternshipCard from "./components/InternshipCard";
import ApplicationCard from "./components/ApplicationCard";
import { usePrevious } from "./hooks/usePrevious";
import { useToggle } from "./hooks/useToggle";

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
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { value: showDetails, toggle: toggleDetails } = useToggle(false);
  const { previousValue } = usePrevious<number | null>(selectedApplicantId);

  useEffect(() => {
    const loadMockData = (): void => {
      setLoading(true);

      window.setTimeout(() => {
        setApplicants(initialApplicants);
        setInternships(initialInternships);
        setApplications(initialApplications);
        setLoading(false);
        searchInputRef.current?.focus();
      }, 300);
    };

    loadMockData();
  }, []);

  const handleContact = (internship: Internship): void => {
    alert(`Contacting host for ${internship.company} (${internship.position})`);
  };

  const handleUpdateStatus = (application: Application, status: string): void => {
    setApplications((prev) => prev.map((item) => (item.id === application.id ? { ...item, status } : item)));
  };

  const handleSelectApplicant = (applicant: Applicant): void => {
    setSelectedApplicantId(applicant.id);
    alert(`Selected: ${applicant.name} (${applicant.role})`);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      applicant.name.toLowerCase().includes(query) ||
      applicant.email.toLowerCase().includes(query) ||
      applicant.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="app">
      <div className="header">
        <h1>Internship Application Tracker</h1>
        <h3>Jashia Deveza IT4B</h3>
      </div>

      <div className="controls">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search applicants"
        />
        <button onClick={toggleDetails}>{showDetails ? "Hide details" : "Show details"}</button>
      </div>

      <p className="status-message">
        {loading
          ? "Loading mock data..."
          : `Showing ${filteredApplicants.length} applicant${filteredApplicants.length === 1 ? "" : "s"}.`}
      </p>

      {selectedApplicantId !== null && (
        <p className="status-message">
          Selected applicant ID: {selectedApplicantId}. Previous selection: {previousValue ?? "none"}.
        </p>
      )}

      <div className="card-grid">
        {filteredApplicants.map((applicant) => {
          const internship = internships.find((item) => item.id === applicant.id);
          const application = applications.find((item) => item.applicantId === applicant.id);

          return (
            <div key={applicant.id} className="combined-card">
              <ApplicantCard applicant={applicant} onSelect={handleSelectApplicant} />

              {showDetails && internship && <InternshipCard internship={internship} onContact={handleContact} />}

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