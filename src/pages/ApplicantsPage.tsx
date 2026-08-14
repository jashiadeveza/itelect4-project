import { useNavigate } from "react-router";
import "../App.css";
import type { Applicant } from "../types";

const sampleApplicants: Applicant[] = [
  { id: 1, name: "Jashia Deveza", email: "jashia@gmail.com", role: "student", isActive: true },
  { id: 2, name: "Giann Villasenor", email: "giann@gmail.com", role: "student", isActive: true },
];

export default function ApplicantsPage() {
  const navigate = useNavigate();

  const goToFirst = () => {
    if (sampleApplicants.length > 0) {
      navigate(`/applicants/${sampleApplicants[0].id}`);
    }
  };

  return (
    <div>
      <h2>Applicants</h2>
      <p>List of applicants in this app's domain.</p>
      <ul>
        {sampleApplicants.map((a) => (
          <li key={a.id}>
            {a.name} — {a.email}
          </li>
        ))}
      </ul>
      <button onClick={goToFirst} className="mt-4 rounded bg-pink-500 px-3 py-1 text-white">Open first applicant</button>
    </div>
  );
}
