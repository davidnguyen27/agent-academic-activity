import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { subjectService } from "@/services/subject.service";
import { curriculumService } from "@/services/curriculum.service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  curriculumId: string;
  onSuccess?: () => void;
}

const ModalSubjectInCurriculum = ({ open, onClose, curriculumId, onSuccess }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [semesterNo, setSemesterNo] = useState<number | "">("");

  useEffect(() => {
    if (open) {
      subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => {
        setSubjects(res.items);
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedSubjectId) return toast.error("Please select a subject");
    if (!semesterNo || semesterNo < 1 || semesterNo > 9) {
      return toast.error("Semester must be between 1 and 9");
    }

    try {
      await curriculumService.createSubjectInCurriculum({
        curriculumId,
        subjectId: selectedSubjectId,
        semesterNo: semesterNo as number,
      });
      toast.success("Subject added successfully!");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Failed to add subject");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Add Subject to Curriculum</DialogTitle>
        </DialogHeader>

        <p id="dialog-description" className="sr-only">
          Choose a subject and semester to add to the selected curriculum.
        </p>

        <div className="space-y-4">
          {/* Select subject */}
          <div>
            <label className="text-sm font-medium block mb-1">Subject</label>
            <Select onValueChange={(value) => setSelectedSubjectId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input semester */}
          <div>
            <label className="text-sm font-medium block mb-1">Semester No (1 - 9)</label>
            <Input
              type="number"
              min={1}
              max={9}
              value={semesterNo}
              onChange={(e) => setSemesterNo(Number(e.target.value))}
              placeholder="Enter semester number"
            />
          </div>

          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubjectInCurriculum;
