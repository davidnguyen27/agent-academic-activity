import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ClipboardCheck,
  Clock,
  FileText,
  CheckCircle,
  BookOpen,
  CircleCheckBig,
  StickyNote,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  assessment: Assessment | null;
  onClose: () => void;
}

const ModalAssessmentDetail = ({ open, assessment, onClose }: Props) => {
  const navigate = useNavigate();

  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ClipboardCheck size={20} />
            Assessment Detail
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mt-2">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <strong>Category:</strong> {assessment.category}
            </p>
            <p className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <strong>Type:</strong> {assessment.type}
            </p>
            <p className="flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <strong>Part:</strong> {assessment.part}
            </p>
            <p className="flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <strong>Weight:</strong> {assessment.weight}%
            </p>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <strong>Criteria:</strong> {assessment.completionCriteria}
            </p>
            <p className="flex items-center gap-2">
              <Clock size={16} className="text-yellow-600" />
              <strong>Duration:</strong> {assessment.duration}
            </p>
            <p className="flex items-center gap-2">
              <FileText size={16} className="text-gray-700" />
              <strong>Question Type:</strong> {assessment.questionType}
            </p>
            <p className="flex items-center gap-2">
              <FileText size={16} className="text-gray-700" />
              <strong>No. of Questions:</strong> {assessment.noQuestion}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div>
            <p className="flex items-center gap-2 font-semibold text-gray-800">
              <CircleCheckBig size={16} className="text-green-700" />
              Knowledge & Skill
            </p>
            <p className="pl-6">{assessment.knowledgeAndSkill || "-"}</p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-semibold text-gray-800">
              <CircleCheckBig size={16} className="text-green-700" />
              Grading Guide
            </p>
            <p className="pl-6">{assessment.gradingGuide || "-"}</p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-semibold text-gray-800">
              <StickyNote size={16} className="text-gray-700" />
              Note
            </p>
            <p className="pl-6">{assessment.note || "-"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/admin/subject/clo-list/assessment")}
          >
            <LayoutDashboard size={16} />
            Manage Assessments
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAssessmentDetail;
