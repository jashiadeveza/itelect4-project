import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "../App.css";
import { api } from "../api/client";
import type { Applicant, ApplicantCreateInput } from "../types";

const initialForm = {
  name: "",
  email: "",
  role: "student" as Applicant["role"],
};

export default function ApplicantsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);

  const { data: applicants = [], isLoading, isError } = useQuery({
    queryKey: ["applicants"],
    queryFn: api.getApplicants,
  });

  const addApplicantMutation = useMutation({
    mutationFn: (draft: ApplicantCreateInput) => api.createApplicant(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      setForm(initialForm);
    },
  });

  const goToFirst = () => {
    if (applicants.length > 0) {
      navigate(`/applicants/${applicants[0].id}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      return;
    }

    addApplicantMutation.mutate({
      name,
      email,
      role: form.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <h2>Applicants</h2>
      <p>List of applicants in this app's domain.</p>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-xl border border-pink-200 p-4">
        <div>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Applicant name"
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Applicant email"
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Applicant["role"] }))}
            className="w-full rounded border px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button type="submit" className="rounded bg-pink-500 px-3 py-2 text-white" disabled={addApplicantMutation.isPending}>
          {addApplicantMutation.isPending ? "Saving..." : "Add applicant"}
        </button>
      </form>

      {isLoading ? (
        <p>Loading applicants...</p>
      ) : isError ? (
        <p>Unable to load applicants.</p>
      ) : (
        <ul>
          {applicants.map((a) => (
            <li key={a.id}>
              {a.name} — {a.email}
            </li>
          ))}
        </ul>
      )}
      <button onClick={goToFirst} className="mt-4 rounded bg-pink-500 px-3 py-1 text-white" disabled={applicants.length === 0}>
        Open first applicant
      </button>
    </div>
  );
}
