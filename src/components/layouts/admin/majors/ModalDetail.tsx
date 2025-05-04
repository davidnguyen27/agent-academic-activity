import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  major: Major | null;
}

const ModalMajorDetail = ({ open, onClose, major }: Props) => {
  const navigate = useNavigate();

  if (!major) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Major Information</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 font-medium">Major Name</p>
            <p className="font-semibold">{major.majorName}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Major Code</p>
            <p className="font-semibold">{major.majorCode}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Start At</p>
            <p className="font-semibold">{major.startAt ? new Date(major.startAt).toLocaleDateString() : "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Status</p>
            <Badge
              variant="outline"
              className={major.isDelete ? "border-red-500 text-red-600" : "border-green-500 text-green-600"}
            >
              {major.isDelete ? "Inactive" : "Active"}
            </Badge>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500 font-medium">Created At</p>
            <p className="font-semibold">{major.createdAt ? new Date(major.createdAt).toLocaleString() : "-"}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/admin/curriculum/major")}
          >
            <Layers size={16} />
            Manage Majors
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMajorDetail;
