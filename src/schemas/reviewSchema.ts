import { z } from "zod";

export const recommendationRequestSchema = z.object({
  applicantId: z
    .string()
    .trim()
    .regex(/^[a-fA-F0-9]{24}$/, "Provide a valid applicantId"),
});

export type RecommendationRequestValues = z.infer<
  typeof recommendationRequestSchema
>;
