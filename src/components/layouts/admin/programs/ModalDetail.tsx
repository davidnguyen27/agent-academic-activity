import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  program: Program | null;
}

const ModalProgramDetail = ({ open, onClose, program }: Props) => {
  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Program Information</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 font-medium">Program Name</p>
            <p className="font-semibold">{program.programName}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Program Code</p>
            <p className="font-semibold">{program.programCode}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Start At</p>
            <p className="font-semibold">{program.startAt ? new Date(program.startAt).toLocaleDateString() : "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Status</p>
            <Badge
              variant="outline"
              className={program.isDeleted ? "border-red-500 text-red-600" : "border-green-500 text-green-600"}
            >
              {program.isDeleted ? "Inactive" : "Active"}
            </Badge>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500 font-medium">Created At</p>
            <p className="font-semibold">{program.createdAt ? new Date(program.createdAt).toLocaleString() : "-"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProgramDetail;
