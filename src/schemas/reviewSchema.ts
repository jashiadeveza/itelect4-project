import { z } from "zod";

export const aiReviewRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Enter at least 20 characters.")
    .max(2000, "Enter no more than 2000 characters."),
});

export type AiReviewRequestValues = z.infer<typeof aiReviewRequestSchema>;

export const recommendationRequestSchema = z.object({
  applicantId: z
    .string()
    .trim()
    .regex(/^[a-fA-F0-9]{24}$/, "Provide a valid applicantId"),
});

export type RecommendationRequestValues = z.infer<
  typeof recommendationRequestSchema
>;
