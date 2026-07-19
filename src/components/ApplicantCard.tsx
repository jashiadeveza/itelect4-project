import type { Applicant } from "../types";

interface ApplicantCardProps {
  applicant: Applicant;
  onSelect: (applicant: Applicant) => void;
}

function ApplicantCard({ applicant, onSelect }: ApplicantCardProps) {
  const handleClick = () => {
    onSelect(applicant);
  };

  return (
    <div className="applicant-card">
      <h2>Applicant</h2>
      <h3>{applicant.name}</h3>
      <p><strong>Email:</strong> {applicant.email}</p>
      <p><strong>Role:</strong> {applicant.role}</p>

      <button onClick={handleClick}>Select Applicant</button>
    </div>
  );
}

export default ApplicantCard;