import type { Applicant } from "../types";

interface ApplicantCardProps {
  applicant: Applicant;
  onSelect: (applicant: Applicant) => void;
  variant?: "default" | "compact";
}

function ApplicantCard({ applicant, onSelect, variant = "default" }: ApplicantCardProps) {
  const handleClick = () => {
    onSelect(applicant);
  };

  const compact = variant === "compact";

  return (
    <div className={`applicant-card rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-pink-900 dark:bg-slate-800 ${compact ? "space-y-2" : "space-y-4"}`}>
      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-300">Applicant</h2>
      <h3 className={`text-pink-500 dark:text-pink-200 ${compact ? "text-base" : "text-xl"}`}>{applicant.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Role:</strong> {applicant.role}</p>
      {!compact && (
        <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Email:</strong> {applicant.email}</p>
      )}

      <button onClick={handleClick} className="w-full rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-600">
        Select Applicant
      </button>
    </div>
  );
}

export default ApplicantCard;
