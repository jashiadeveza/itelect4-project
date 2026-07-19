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
    <div className="application-card">
      <h2>Application</h2>
      <p><strong>Application ID:</strong> #{application.id}</p>
      <p><strong>Applicant ID:</strong> {application.applicantId}</p>
      <p><strong>Internship ID:</strong> {application.internshipId}</p>
      <p><strong>Status:</strong> {application.status}</p>
      {children}
      <div style={{ marginTop: 10 }}>
        <button onClick={handleUpdate}>Update Status</button>
      </div>
    </div>
  );
}

export default ApplicationCard;