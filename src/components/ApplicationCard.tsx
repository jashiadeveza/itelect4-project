import type React from "react";
import type { Application } from "../types";

interface ApplicationCardProps {
  application: Application;
  children?: React.ReactNode;
  onUpdateStatus?: (application: Application, status: string) => void;
}

function ApplicationCard({ application, children, onUpdateStatus }: ApplicationCardProps) {
  const handleUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const next = window.prompt("New status:", application.status);
    if (next) onUpdateStatus?.(application, next);
  };

  return (
    <div className="application-card rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-pink-900 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-300">Application</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Application ID:</strong> #{application.id}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Applicant ID:</strong> {application.applicantId}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Internship ID:</strong> {application.internshipId}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-pink-700 dark:text-pink-400">Status:</strong> {application.status}</p>
      {children}
      <div className="mt-3">
        <button onClick={handleUpdate} className="w-full rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-600">
          Update Status
        </button>
      </div>
    </div>
  );
}

export default ApplicationCard;
