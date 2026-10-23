import { useQuery } from "@tanstack/react-query";
import "../App.css";
import InternshipCard from "../components/InternshipCard";
import { api } from "../api/client";

export default function InternshipsPage() {
  const { data: internships = [], isLoading, isError } = useQuery({
    queryKey: ["internships"],
    queryFn: api.getInternships,
  });

  return (
    <div className="panel">
      <h2>Internships</h2>
      <p>List of available internships and positions.</p>

      {isLoading ? (
        <p>Loading internships...</p>
      ) : isError ? (
        <p>Unable to load internships.</p>
      ) : (
        <div className="card-grid" style={{ marginTop: 12 }}>
          {internships.map((i) => (
            <div key={i.id} className="combined-card">
              <InternshipCard internship={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
