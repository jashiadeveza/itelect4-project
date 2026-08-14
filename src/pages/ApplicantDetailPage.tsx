import { useParams, Link } from "react-router";
import "../App.css";
import { applicants } from "../data";

type Params = { id: string };

export default function ApplicantDetailPage() {
  const params = useParams<Params>();
  const idParam = params.id;
  const id = idParam ? Number(idParam) : NaN;

  const applicant = applicants.find((a) => a.id === id) ?? null;

  if (!applicant) {
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
