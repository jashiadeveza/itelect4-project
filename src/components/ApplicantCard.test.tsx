import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicantCard from "./ApplicantCard";
import type { Applicant } from "../types";

describe("ApplicantCard", () => {
  it("hides the applicant email in compact mode", () => {
    const applicant: Applicant = {
      id: "applicant-1",
      name: "Alex Rivera",
      email: "alex@example.com",
      role: "student",
      isActive: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    };

    const { rerender } = render(
      <ApplicantCard applicant={applicant} onSelect={vi.fn()} />,
    );

    expect(screen.getByText("alex@example.com")).toBeInTheDocument();

    rerender(
      <ApplicantCard
        applicant={applicant}
        onSelect={vi.fn()}
        variant="compact"
      />,
    );

    expect(screen.queryByText("alex@example.com")).not.toBeInTheDocument();
  });
});
