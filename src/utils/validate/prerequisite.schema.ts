import { z } from "zod";

export const prerequisiteSchema = z.object({
  prerequisiteConstraintCode: z.string().min(1, {
    message: "Constraint code is required",
  }),
  groupCombinationType: z.enum(["AND", "OR"], {
    required_error: "Group combination type is required",
    invalid_type_error: "Group combination type must be 'AND' or 'OR'",
  }),
  subjectId: z.string().uuid({
    message: "Subject is required",
  }),
});

export type PrerequisiteForm = z.infer<typeof prerequisiteSchema>;
export type PrerequisiteInput = Omit<Prerequisite, "prerequisiteConstraintId">;
