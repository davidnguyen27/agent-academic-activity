import { z } from "zod";

export const poSchema = z.object({
  programingOutcomeCode: z.string().min(1, "Programming Outcome code is required"),
  programingOutcomeName: z.string().min(1, "Programming Outcome name is required"),
  description: z.string().min(1, "Description is required"),
  programId: z.string().uuid("Invalid major ID (must be UUID)."),
});

export type POFormData = z.infer<typeof poSchema>;
export type POInput = Omit<PO, "programingOutcomeId">;
