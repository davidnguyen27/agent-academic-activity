import { z } from "zod";

export const ploSchema = z.object({
  programingLearningOutcomeCode: z.string().min(1, "Code is required").max(50, "Code must be at most 50 characters"),

  programingLearningOutcomeName: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),

  description: z.string().optional().or(z.literal("")),
  curriculumId: z.string().uuid({
    message: "Curriculum is required",
  }),
});

export type PLOFormData = z.infer<typeof ploSchema>;
export type PLOInput = Omit<PLO, "programingLearningOutcomeId">;
