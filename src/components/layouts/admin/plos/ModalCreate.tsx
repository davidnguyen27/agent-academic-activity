import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { ploService } from "@/services/plo.service";
import { ploSchema, PLOFormData } from "@/utils/validate/plo.schema";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  curriculums: Curriculum[];
}

const ModalCreatePLO = ({ open, onClose, onCreated, curriculums }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PLOFormData>({
    resolver: zodResolver(ploSchema),
  });

  const onSubmit = async (data: PLOFormData) => {
    try {
      setIsLoading(true);
      await ploService.createPLO({
        ...data,
        description: data.description || "",
      });
      toast.success("PLO created successfully!");
      onClose();
      onCreated?.();
      reset();
    } catch {
      toast.error("Failed to create PLO");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Create New PLO</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div>
            <Label htmlFor="programingLearningOutcomeCode">PLO Code</Label>
            <Input
              id="programingLearningOutcomeCode"
              placeholder="Enter PLO code"
              {...register("programingLearningOutcomeCode")}
            />
            {errors.programingLearningOutcomeCode && (
              <p className="text-xs text-red-500 mt-1">{errors.programingLearningOutcomeCode.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="programingLearningOutcomeName">PLO Name</Label>
            <Input
              id="programingLearningOutcomeName"
              placeholder="Enter PLO name"
              {...register("programingLearningOutcomeName")}
            />
            {errors.programingLearningOutcomeName && (
              <p className="text-xs text-red-500 mt-1">{errors.programingLearningOutcomeName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Optional..." {...register("description")} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="curriculumId">Curriculum</Label>
            <select
              id="curriculumId"
              {...register("curriculumId")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">-- Select curriculum --</option>
              {curriculums.map((curr) => (
                <option key={curr.curriculumId} value={curr.curriculumId}>
                  {curr.curriculumName}
                </option>
              ))}
            </select>
            {errors.curriculumId && <p className="text-xs text-red-500 mt-1">{errors.curriculumId.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreatePLO;
