import { z } from "zod";

export const assessmentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  part: z.number().min(1, "Part must be at least 1"),
  weight: z.number().min(0, "Weight must be a positive number"),
  completionCriteria: z.string().min(1, "Completion criteria is required"),
  duration: z.string().min(1, "Duration is required"),
  questionType: z.string().min(1, "Question type is required"),
  noQuestion: z.string().min(1, "Number of questions is required"),
  knowledgeAndSkill: z.string().min(1, "Knowledge and skill is required"),
  gradingGuide: z.string().min(1, "Grading guide is required"),
  note: z.string().optional(),
  subjectId: z.string().min(1, "Subject ID is required"),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
export type AssessmentInput = Omit<AssessmentFormData, "assessmentId">;
