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
    <div className="internship-card">
      <h2>Internship</h2>
      <h3>{internship.company}</h3>
      <p><strong>Position:</strong> {internship.position}</p>
      <p><strong>Location:</strong> {internship.location}</p>
      <p><strong>Available Slots:</strong> {internship.availableSlots}</p>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleContact}>Contact Host</button>
      </div>
    </div>
  );
}

export default InternshipCard;