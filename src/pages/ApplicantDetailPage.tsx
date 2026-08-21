import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import "../App.css";
import { api } from "../api/client";

type Params = { id: string };

export default function ApplicantDetailPage() {
  const params = useParams<Params>();
  const idParam = params.id;
  const id = idParam ? Number(idParam) : NaN;

  const { data: applicant, isLoading, isError } = useQuery({
    queryKey: ["applicant", idParam ?? ""],
    queryFn: () => api.getApplicantById(id),
    enabled: Number.isFinite(id),
  });

  if (isLoading) {
    return <div className="panel">Loading applicant...</div>;
  }

  if (isError || !applicant) {
    return (
      <div className="panel">
        <h2>Applicant Not Found</h2>
        <p>Unable to find an applicant with id: {idParam}</p>
        <p>
          Return to <Link to="/applicants">Applicants</Link>.
        </p>
      </div>
    );
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
