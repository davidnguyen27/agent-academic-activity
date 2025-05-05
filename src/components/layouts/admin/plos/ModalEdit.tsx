import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ploSchema, PLOFormData } from "@/utils/validate/plo.schema";
import { ploService } from "@/services/plo.service";

interface Props {
  open: boolean;
  onClose: () => void;
  plo: PLO | null;
  onUpdated?: () => void;
  curriculums: Curriculum[];
}

const ModalEditPLO = ({ open, onClose, plo, onUpdated, curriculums }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PLOFormData>({
    resolver: zodResolver(ploSchema),
  });

  useEffect(() => {
    if (plo) {
      reset({
        programingLearningOutcomeCode: plo.programingLearningOutcomeCode,
        programingLearningOutcomeName: plo.programingLearningOutcomeName,
        description: plo.description || "",
        curriculumId: plo.curriculumId,
      });
    }
  }, [plo, reset]);

  const onSubmit = async (data: PLOFormData) => {
    if (!plo) return;

    setIsLoading(true);
    try {
      await ploService.updatePLO(plo.programingLearningOutcomeId, {
        ...data,
        description: data.description || "",
      });
      toast.success("PLO updated successfully!");
      onClose();
      onUpdated?.();
    } catch {
      toast.error("Failed to update PLO");
    } finally {
      setIsLoading(false);
    }
  };

  if (!plo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Edit PLO</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div>
            <Label htmlFor="programingLearningOutcomeCode">PLO Code</Label>
            <Input id="programingLearningOutcomeCode" {...register("programingLearningOutcomeCode")} />
            {errors.programingLearningOutcomeCode && (
              <p className="text-xs text-red-500 mt-1">{errors.programingLearningOutcomeCode.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="programingLearningOutcomeName">PLO Name</Label>
            <Input id="programingLearningOutcomeName" {...register("programingLearningOutcomeName")} />
            {errors.programingLearningOutcomeName && (
              <p className="text-xs text-red-500 mt-1">{errors.programingLearningOutcomeName.message}</p>
            )}
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditPLO;
