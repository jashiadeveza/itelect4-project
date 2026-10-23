import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import "../App.css";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

type Params = { id: string };

export default function ApplicantDetailPage() {
  const params = useParams<Params>();
  const idParam = params.id;
  const userName = useAuthStore((state) => state.userName);

  const { data: applicant, error, isLoading, isError } = useQuery({
    queryKey: ["applicant", userName, idParam ?? ""],
    queryFn: () => api.getApplicantById(idParam ?? ""),
    enabled: Boolean(idParam),
  });

  if (isLoading) {
    return <div className="panel">Loading applicant...</div>;
  }

  if (isError) {
    const notFound =
      error instanceof Error && /applicant not found/i.test(error.message);
    return (
      <div className="panel">
        <h2>{notFound ? "Applicant Not Found" : "Unable to Load Applicant"}</h2>
        <p>
          {notFound
            ? `Unable to find an applicant with id: ${idParam}`
            : error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
        </p>
        <p>
          Return to <Link to="/applicants">Applicants</Link>.
        </p>
      </div>
    );
  }

  if (!applicant) {
    return <div className="panel">Loading applicant...</div>;
  }

  return (
    <div className="panel applicant-card">
      <h2>Applicant</h2>

      <h3>{applicant.name}</h3>
      <p>
        <strong>Role:</strong> {applicant.role}
      </p>
      <p>
        <strong>Email:</strong> {applicant.email}
      </p>
      <p>
        <strong>Status:</strong> {applicant.isActive ? "Active" : "Inactive"}
      </p>

      <div style={{ marginTop: 12 }}>
        <Link to="/applicants" className="nav-link">Back to applicants</Link>
      </div>
    </div>
  );
}
