import type React from "react";
import type { Internship } from "../types";

interface InternshipCardProps {
  internship: Internship;
  onContact?: (internship: Internship) => void;
}

function InternshipCard({ internship, onContact }: InternshipCardProps) {
  const handleContact = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onContact?.(internship);
  };

  return (
    <div className="internship-card rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-pink-900 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-300">Internship</h2>
      <h3 className="text-pink-500 dark:text-pink-200">{internship.company}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Position:</strong> {internship.position}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Location:</strong> {internship.location}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Available Slots:</strong> {internship.availableSlots}</p>
      <div className="mt-3">
        <button onClick={handleContact} className="w-full rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-600">
          Contact Host
        </button>
      </div>
    </div>
  );
}

export default InternshipCard;
