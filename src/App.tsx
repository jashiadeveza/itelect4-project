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
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { value: showDetails, toggle: toggleDetails } = useToggle(false);
  const { previousValue } = usePrevious<number | null>(selectedApplicantId);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const loadMockData = (): void => {
      setLoading(true);
      setError(null);

      window.setTimeout(() => {
        try {
          setApplicants(initialApplicants);
          setInternships(initialInternships);
          setApplications(initialApplications);
          setLoading(false);
          searchInputRef.current?.focus();
        } catch {
          setError("Unable to load mock data.");
          setLoading(false);
        }
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
      <div className="header relative">
        <button
          onClick={() => setDarkMode((value) => !value)}
          className="dark-toggle absolute right-4 top-4 z-10 rounded-full bg-white/15 px-3 py-1 text-[0.65rem] font-semibold text-white shadow-sm shadow-black/20 transition hover:bg-white/25 dark:bg-pink-500 dark:hover:bg-pink-600"
          style={{ width: "auto" }}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

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
        <button onClick={toggleDetails} className="rounded-xl bg-pink-500 px-4 py-2 text-white transition hover:bg-pink-600">
          {showDetails ? "Hide details" : "Show details"}
        </button>
      </div>

      {loading ? (
        <div className="status-message loading-state">Loading mock data...</div>
      ) : error ? (
        <div className="status-message error-state">Error loading mock data. Please refresh.</div>
      ) : (
        <p className="status-message">Showing {filteredApplicants.length} applicant{filteredApplicants.length === 1 ? "" : "s"}.</p>
      )}

      {selectedApplicantId !== null && !loading && !error && (
        <p className="status-message">
          Selected applicant ID: {selectedApplicantId}. Previous selection: {previousValue ?? "none"}.
        </p>
      )}

      <div className="card-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApplicants.map((applicant) => {
          const internship = internships.find((item) => item.id === applicant.id);
          const application = applications.find((item) => item.applicantId === applicant.id);

          return (
            <div key={applicant.id} className="combined-card">
              <ApplicantCard applicant={applicant} onSelect={handleSelectApplicant} variant={showDetails ? "default" : "compact"} />

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
