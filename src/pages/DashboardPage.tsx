import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "../App.css";
import ApplicantCard from "../components/ApplicantCard";
import InternshipCard from "../components/InternshipCard";
import ApplicationCard from "../components/ApplicationCard";
import { Button } from "../components/ui/button";
import { usePrevious } from "../hooks/usePrevious";
import { useToggle } from "../hooks/useToggle";
import { useUiStore } from "../store/uiStore";
import { api } from "../api/client";

import type { Applicant, Internship, Application } from "../types";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [applicantId, setApplicantId] = useState("");
  const [internshipId, setInternshipId] = useState("");
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const selectedApplicantId = useUiStore((state) => state.selectedApplicantId);
  const setSelectedApplicantId = useUiStore((state) => state.setSelectedApplicantId);

  const { data: applicants = [], isLoading: applicantsLoading, isError: applicantsError } = useQuery({
    queryKey: ["applicants"],
    queryFn: api.getApplicants,
  });

  const { data: internships = [], isLoading: internshipsLoading } = useQuery({
    queryKey: ["internships"],
    queryFn: api.getInternships,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: api.getApplications,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { value: showDetails, toggle: toggleDetails } = useToggle(false);
  const { previousValue } = usePrevious<string | null>(selectedApplicantId);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: ({ application, status }: { application: Application; status: string }) =>
      api.updateApplicationStatus(application.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: api.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setApplicantId("");
      setInternshipId("");
    },
  });

  const handleContact = (internship: Internship): void => {
    alert(`Contacting host for ${internship.company} (${internship.position})`);
  };

  const handleUpdateStatus = (application: Application, status: string): void => {
    updateStatusMutation.mutate({ application, status });
  };

  const handleSelectApplicant = (applicant: Applicant): void => {
    setSelectedApplicantId(applicant.id);
    alert(`Selected: ${applicant.name} (${applicant.role})`);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleCreateApplication = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createApplicationMutation.mutate({ applicantId, internshipId });
  };

  const loading = applicantsLoading || internshipsLoading || applicationsLoading;
  const error = applicantsError ? "Unable to load applicants." : null;

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
    <>
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
        <div className="status-message loading-state">Loading data...</div>
      ) : error ? (
        <div className="status-message error-state">{error}</div>
      ) : (
        <p className="status-message">Showing {filteredApplicants.length} applicant{filteredApplicants.length === 1 ? "" : "s"}.</p>
      )}

      {selectedApplicantId !== null && !loading && !error && (
        <p className="status-message">
          Selected applicant ID: {selectedApplicantId}. Previous selection: {previousValue ?? "none"}.
        </p>
      )}

      <section className="my-6 rounded-xl border border-pink-200 p-4">
        <h2 className="mb-3 text-xl font-semibold">Create application</h2>
        <form onSubmit={handleCreateApplication} className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span>Applicant</span>
            <select
              required
              value={applicantId}
              onChange={(event) => setApplicantId(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="" disabled>Select an applicant</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.name} ({applicant.email})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span>Internship</span>
            <select
              required
              value={internshipId}
              onChange={(event) => setInternshipId(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="" disabled>Select an internship</option>
              {internships.map((internship) => (
                <option key={internship.id} value={internship.id}>
                  {internship.position} — {internship.company}
                </option>
              ))}
            </select>
          </label>
          {createApplicationMutation.isError && (
            <p role="alert" className="text-red-600 sm:col-span-2">
              {createApplicationMutation.error.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={
              createApplicationMutation.isPending ||
              applicants.length === 0 ||
              internships.length === 0
            }
            className="justify-self-start sm:col-span-2"
          >
            {createApplicationMutation.isPending
              ? "Creating..."
              : "Create application"}
          </Button>
          {applicants.length === 0 && (
            <p className="text-sm sm:col-span-2">
              Add an applicant before creating an application.
            </p>
          )}
          {internships.length === 0 && (
            <p className="text-sm sm:col-span-2">
              Internship options are unavailable until reference data is seeded.
            </p>
          )}
        </form>
      </section>

      <div className="card-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApplicants.map((applicant) => {
          const application = applications.find((item) => item.applicantId === applicant.id);
          const internship = application ? internships.find((item) => item.id === application.internshipId) : undefined;

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

      <div className="footer">GT 3 Part 3</div>
    </>
  );
}
