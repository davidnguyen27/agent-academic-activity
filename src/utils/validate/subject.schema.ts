import { z } from "zod";

export const subjectSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  decisionNo: z.string().optional(),
  isActive: z.boolean(),
  isApproved: z.boolean(),
  noCredit: z.coerce.number().min(0),
  approvedDate: z.string().optional(),
  curriculumId: z.string().optional(),
  sessionNo: z.coerce.number().min(0),
  syllabusName: z.string().optional(),
  degreeLevel: z.string().optional(),
  timeAllocation: z.string().optional(),
  description: z.string().optional(),
  studentTasks: z.string().optional(),
  scoringScale: z.coerce.number().min(0),
  minAvgMarkToPass: z.coerce.number().min(0),
  note: z.string().optional(),
  toolIds: z.array(z.string()).optional(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
