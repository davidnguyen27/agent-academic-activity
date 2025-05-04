import { z } from "zod";

export const cloSchema = z.object({
  courseLearningOutcomeCode: z.string().min(1, "CLO code is required"),
  courseLearningOutcomeName: z.string().min(1, "CLO name is required"),
  courseLearningOutcomeDetail: z.string().min(1, "CLO detail is required"),
  subjectId: z.string().uuid("Subject ID must be a valid UUID"),
  assessmentId: z.string().uuid("Assessment ID must be a valid UUID"),
});

export type CLOFormData = z.infer<typeof cloSchema>;
export type CLOInput = Omit<CLO, "courseLearningOutcomeId">;
