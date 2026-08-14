import "../App.css";
import { internships } from "../data";
import InternshipCard from "../components/InternshipCard";

export default function InternshipsPage() {
  return (
    <div className="panel">
      <h2>Internships</h2>
      <p>List of available internships and positions.</p>

      <div className="card-grid" style={{ marginTop: 12 }}>
        {internships.map((i) => (
          <div key={i.id} className="combined-card">
            <InternshipCard internship={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
