interface Assessment {
  assessmentId: string;
  category: string;
  type: string;
  part: number;
  weight: number;
  completionCriteria: string;
  duration: string;
  questionType: string;
  noQuestion: string;
  knowledgeAndSkill: string;
  gradingGuide: string;
  note: string;
  subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
}
