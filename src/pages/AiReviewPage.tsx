import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../components/ui/button";
import { api } from "../api/client";
import {
  aiReviewRequestSchema,
  type AiReviewRequestValues,
} from "../schemas/reviewSchema";

const recommendationLabels = {
  strong_match: "Strong match",
  potential_match: "Potential match",
  needs_more_information: "Needs more information",
} as const;

export default function AiReviewPage() {
  const reviewMutation = useMutation({
    mutationFn: api.askAi,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AiReviewRequestValues>({
    resolver: zodResolver(aiReviewRequestSchema),
    defaultValues: { prompt: "" },
  });
  const prompt = useWatch({ control, name: "prompt", defaultValue: "" });
  const characterCount = prompt.trim().length;

  const submitReview = (values: AiReviewRequestValues) => {
    reviewMutation.mutate(values.prompt);
  };

  return (
    <section className="my-6 max-w-3xl rounded-xl border border-pink-200 p-5 dark:border-pink-900">
      <h2 className="mb-2 text-2xl font-semibold">AI Internship Review</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Describe an applicant, internship, or application. The AI will review your notes.
      </p>

      <form onSubmit={handleSubmit(submitReview)} className="grid gap-3">
        <label htmlFor="ai-review-prompt" className="font-medium">
          Internship notes
        </label>
        <textarea
          id="ai-review-prompt"
          {...register("prompt")}
          rows={7}
          maxLength={2000}
          placeholder="Describe the applicant's experience and the internship requirements..."
          aria-invalid={Boolean(errors.prompt)}
          aria-describedby="ai-review-count ai-review-error"
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span id="ai-review-count">
            Enter 20–2000 characters ({characterCount}/2000).
          </span>
          {errors.prompt?.message && (
            <span id="ai-review-error" role="alert" className="text-red-600">
              {errors.prompt.message}
            </span>
          )}
        </div>

        {reviewMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {reviewMutation.error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={reviewMutation.isPending}
          className="justify-self-start"
        >
          {reviewMutation.isPending ? "Reviewing..." : "Review notes"}
        </Button>
      </form>

      {reviewMutation.data && (
        <section
          className="mt-6 grid gap-4 rounded-lg border border-border p-4"
          aria-labelledby="ai-review-result"
          aria-live="polite"
        >
          <div>
            <h3 id="ai-review-result" className="text-lg font-semibold">
              AI review
            </h3>
            <p className="mt-1 text-sm">
              Recommendation:{" "}
              <span className="font-semibold">
                {recommendationLabels[reviewMutation.data.recommendation]}
              </span>
            </p>
          </div>
          <p className="text-sm">{reviewMutation.data.summary}</p>
          <div>
            <h4 className="font-semibold">Strengths</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {reviewMutation.data.strengths.map((strength, index) => (
                <li key={`${index}-${strength}`}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Areas to improve or clarify</h4>
            {reviewMutation.data.improvementAreas.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {reviewMutation.data.improvementAreas.map((area, index) => (
                  <li key={`${index}-${area}`}>{area}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm">No specific gaps were identified in the notes.</p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
