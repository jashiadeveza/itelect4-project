import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "../App.css";
import ApplicantCard from "../components/ApplicantCard";
import InternshipCard from "../components/InternshipCard";
import ApplicationCard from "../components/ApplicationCard";
import { Button } from "../components/ui/button";
import { usePrevious } from "../hooks/usePrevious";
import { useToggle } from "../hooks/useToggle";
import { useUiStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/client";
import {
  recommendationRequestSchema,
  type RecommendationRequestValues,
} from "../schemas/reviewSchema";

import type {
  Applicant,
  Application,
  Internship,
  InternshipRecommendation,
} from "../types";

const SLOT_BADGE_STYLE = {
  none: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  limited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  available: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
} as const;

function getSlotBadge(recommendation: InternshipRecommendation) {
  if (recommendation.availableSlots === 0) {
    return {
      label: "No slots",
      className: SLOT_BADGE_STYLE.none,
    };
  }
  if (recommendation.availableSlots === 1) {
    return {
      label: "1 slot left",
      className: SLOT_BADGE_STYLE.limited,
    };
  }
  return {
    label: `${recommendation.availableSlots} slots available`,
    className: SLOT_BADGE_STYLE.available,
  };
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const userName = useAuthStore((state) => state.userName);
  const [applicantId, setApplicantId] = useState("");
  const [internshipId, setInternshipId] = useState("");
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const selectedApplicantId = useUiStore((state) => state.selectedApplicantId);
  const setSelectedApplicantId = useUiStore((state) => state.setSelectedApplicantId);

  const { data: applicants = [], isLoading: applicantsLoading, isError: applicantsError } = useQuery({
    queryKey: ["applicants", userName],
    queryFn: api.getApplicants,
  });

  const { data: internships = [], isLoading: internshipsLoading } = useQuery({
    queryKey: ["internships"],
    queryFn: api.getInternships,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications", userName],
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
      queryClient.invalidateQueries({ queryKey: ["applications", userName] });
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: api.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", userName] });
      setApplicantId("");
      setInternshipId("");
    },
  });

  const recommendationsMutation = useMutation({
    mutationFn: api.getInternshipRecommendations,
  });

  const {
    register: registerRecommendation,
    handleSubmit: handleRecommendationSubmit,
    formState: { errors: recommendationErrors },
  } = useForm<RecommendationRequestValues>({
    resolver: zodResolver(recommendationRequestSchema),
    defaultValues: { applicantId: "" },
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

  const handleRecommendInternships = (
    values: RecommendationRequestValues,
  ): void => {
    recommendationsMutation.mutate(values.applicantId);
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

      <section
        id="ai-recommendations"
        className="my-6 scroll-mt-4 rounded-xl border border-pink-200 p-4"
      >
        <h2 className="mb-3 text-xl font-semibold">AI internship recommendations</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Choose an applicant to find available internships that may be a good fit for their role.
        </p>
        <form
          onSubmit={handleRecommendationSubmit(handleRecommendInternships)}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label className="grid gap-1.5">
            <span>Applicant</span>
            <select
              {...registerRecommendation("applicantId")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="" disabled>Select an applicant</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.name} ({applicant.role})
                </option>
              ))}
            </select>
          </label>
          <Button
            type="submit"
            disabled={
              recommendationsMutation.isPending ||
              applicants.length === 0
            }
            className="justify-self-start self-end"
          >
            {recommendationsMutation.isPending
              ? "Finding matches..."
              : "Find internships"}
          </Button>
        </form>
        {applicants.length === 0 && (
          <p className="mt-3 text-sm">Add an applicant before requesting recommendations.</p>
        )}
        {recommendationErrors.applicantId?.message && (
          <p role="alert" className="mt-3 text-red-600">
            {recommendationErrors.applicantId.message}
          </p>
        )}
        {recommendationsMutation.isError && (
          <p role="alert" className="mt-3 text-red-600">
            {recommendationsMutation.error.message}
          </p>
        )}
        {recommendationsMutation.data && (
          recommendationsMutation.data.recommendations.length > 0 ? (
            <section className="mt-5" aria-labelledby="recommendation-results-heading">
              <h3
                id="recommendation-results-heading"
                className="mb-3 text-lg font-semibold"
              >
                Recommended internships
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendationsMutation.data.recommendations.map((recommendation) => {
                  const slotBadge = getSlotBadge(recommendation);
                  return (
                    <article
                      key={recommendation.id}
                      className="rounded-xl border border-pink-200 p-4 dark:border-pink-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold">
                          {recommendation.position} at {recommendation.company}
                        </h4>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${slotBadge.className}`}
                        >
                          {slotBadge.label}
                        </span>
                      </div>
                      <p className="text-sm">{recommendation.location}</p>
                      <h5 className="mt-3 text-sm font-semibold">Why this may fit</h5>
                      <p className="text-sm">{recommendation.reason}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <p className="mt-3 text-sm">
              No eligible internships are available for this applicant right now.
            </p>
          )
        )}
      </section>

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

      <div className="footer">Finals</div>
    </>
  );
}
