import { z } from "zod";

export const applicantFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    role: z.enum(["student", "admin", "instructor"], {
      message: "Select a valid role.",
    }),
  })
  .refine((values) => values.name.trim().toLowerCase() !== values.email.trim().toLowerCase(), {
    message: "Name and email must be different.",
    path: ["email"],
  });

export type ApplicantFormValues = z.infer<typeof applicantFormSchema>;