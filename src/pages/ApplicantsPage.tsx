import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import { api } from "../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { applicantFormSchema, type ApplicantFormValues } from "../schemas/applicantSchema";
import type { ApplicantCreateInput } from "../types";

export default function ApplicantsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantFormSchema),
    defaultValues: { name: "", email: "", role: "student" },
  });

  const { data: applicants = [], isLoading, isError } = useQuery({
    queryKey: ["applicants"],
    queryFn: api.getApplicants,
  });

  const addApplicantMutation = useMutation({
    mutationFn: (draft: ApplicantCreateInput) => api.createApplicant(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      reset();
    },
  });

  const goToFirst = () => {
    if (applicants.length > 0) {
      navigate(`/applicants/${applicants[0].id}`);
    }
  };

  const onSubmit = (values: ApplicantFormValues) => {
    addApplicantMutation.mutate({
      name: values.name,
      email: values.email,
      role: values.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <h2>Applicants</h2>
      <p>List of applicants in this app's domain.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-3 rounded-xl border border-pink-200 p-4" noValidate>
        <div>
          <Label htmlFor="applicant-name">Name</Label>
          <Input id="applicant-name" {...register("name")} aria-invalid={Boolean(errors.name)} placeholder="Applicant name" />
          {errors.name && <p role="alert">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="applicant-email">Email</Label>
          <Input id="applicant-email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} placeholder="Applicant email" />
          {errors.email && <p role="alert">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="applicant-role">Role</Label>
          <select
            id="applicant-role"
            {...register("role")}
            aria-invalid={Boolean(errors.role)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role && <p role="alert">{errors.role.message}</p>}
        </div>
        <Button type="submit" disabled={addApplicantMutation.isPending}>
          {addApplicantMutation.isPending ? "Saving..." : "Add applicant"}
        </Button>
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
      <Button onClick={goToFirst} className="mt-4" disabled={applicants.length === 0}>
        Open first applicant
      </Button>
    </div>
  );
}
