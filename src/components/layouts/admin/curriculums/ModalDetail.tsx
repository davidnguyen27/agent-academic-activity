import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  curriculum: Curriculum | null;
}

const ModalCurriculumDetail = ({ open, onClose, curriculum }: Props) => {
  const navigate = useNavigate();

  if (!curriculum) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Curriculum Information</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 font-medium">Curriculum Name</p>
            <p className="font-semibold">{curriculum.curriculumName}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Curriculum Code</p>
            <p className="font-semibold">{curriculum.curriculumCode}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Decision No</p>
            <p className="font-semibold">{curriculum.decisionNo}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Status</p>
            <Badge
              variant="outline"
              className={curriculum.isDelete ? "border-red-500 text-red-600" : "border-green-500 text-green-600"}
            >
              {curriculum.isDelete ? "Inactive" : "Active"}
            </Badge>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Approval</p>
            <Badge
              variant="outline"
              className={curriculum.isApproved ? "border-blue-500 text-blue-600" : "border-yellow-500 text-yellow-600"}
            >
              {curriculum.isApproved ? "Approved" : "Pending"}
            </Badge>
          </div>

          {curriculum.preRequisite && (
            <div className="col-span-2">
              <p className="text-gray-500 font-medium">Pre-requisite</p>
              <p className="font-semibold">{curriculum.preRequisite}</p>
            </div>
          )}

          {curriculum.description && (
            <div className="col-span-2">
              <p className="text-gray-500 font-medium">Description</p>
              <p className="font-semibold">{curriculum.description}</p>
            </div>
          )}

          <div className="col-span-2">
            <p className="text-gray-500 font-medium">Created At</p>
            <p className="font-semibold">
              {curriculum.createdAt ? new Date(curriculum.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/admin/curriculum")}>
            <BookOpen size={16} />
            Manage Curriculums
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCurriculumDetail;
