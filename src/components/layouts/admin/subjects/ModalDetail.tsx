import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Timer, CheckCircle2, Clock, Info } from "lucide-react";

interface Props {
  open: boolean;
  subject: Subject | null;
  onClose: () => void;
}

const ModalSubjectDetail = ({ open, subject, onClose }: Props) => {
  if (!subject) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <BookOpen size={20} /> Subject Detail
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mt-2">
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <strong>Code:</strong> {subject.subjectCode}
            </p>
            <p className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <strong>Name:</strong> {subject.subjectName}
            </p>
            <p className="flex items-center gap-2">
              <Award size={16} className="text-yellow-600" />
              <strong>Credits:</strong> {subject.noCredit}
            </p>
            <p className="flex items-center gap-2">
              <Award size={16} className="text-yellow-600" />
              <strong>Degree Level:</strong> {subject.degreeLevel}
            </p>
            <p className="flex items-center gap-2">
              <Timer size={16} className="text-purple-600" />
              <strong>Session No:</strong> {subject.sessionNo}
            </p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <Award size={16} className="text-green-600" />
              <strong>Scoring Scale:</strong> {subject.scoringScale}
            </p>
            <p className="flex items-center gap-2">
              <Award size={16} className="text-green-600" />
              <strong>Min Avg Mark:</strong> {subject.minAvgMarkToPass}
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <strong>Approved:</strong>
              <Badge
                variant="outline"
                className={subject.isApproved ? "text-green-700 border-green-500" : "text-red-700 border-red-500"}
              >
                {subject.isApproved ? "Yes" : "No"}
              </Badge>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <strong>Active:</strong>
              <Badge
                variant="outline"
                className={subject.isActive ? "text-green-700 border-green-500" : "text-red-700 border-red-500"}
              >
                {subject.isActive ? "Yes" : "No"}
              </Badge>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="flex items-center gap-2 font-semibold text-gray-800">
            <Clock size={16} className="text-indigo-500" />
            Time Allocation
          </p>
          <p className="text-gray-700">{subject.timeAllocation}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 font-semibold text-gray-800">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Completion Criteria
          </p>
          <p className="text-gray-700">{subject.note}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 font-semibold text-gray-800">
            <Info size={16} className="text-gray-600" />
            Description
          </p>
          <p className="text-gray-700">{subject.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubjectDetail;
