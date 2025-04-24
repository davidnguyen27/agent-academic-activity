import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramFormData, programSchema } from "@/utils/validate/program.schema";
import { programService } from "@/services/program.service";
import { useEffect } from "react";
import { toast } from "sonner";
import { formatDateTime } from "@/utils/format/date-time.format";

interface ProgramEditDialogProps {
  open: boolean;
  program: Program | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ProgramEditDialog = ({ open, program, onOpenChange, onSuccess }: ProgramEditDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      programCode: "",
      programName: "",
      startAt: "",
    },
  });

  useEffect(() => {
    if (program) {
      reset({
        ...program,
        startAt: program.startAt.split("T")[0],
      });
    }
  }, [program, reset]);

  const onSubmit = async (data: ProgramFormData) => {
    try {
      await programService.updateProgram(program!.programId, {
        ...data,
        startAt: new Date(data.startAt).toISOString(),
      });
      toast.success("Program updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to update program.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Program</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="programCode">Program Code</Label>
            <Input id="programCode" {...register("programCode")} />
            {errors.programCode && <p className="text-sm text-red-500">{errors.programCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="programName">Program Name</Label>
            <Input id="programName" {...register("programName")} />
            {errors.programName && <p className="text-sm text-red-500">{errors.programName.message}</p>}
          </div>

          <div>
            <Label htmlFor="startAt">Start At</Label>
            <Input type="date" id="startAt" {...register("startAt")} />
            {errors.startAt && <p className="text-sm text-red-500">{errors.startAt.message}</p>}
          </div>

          <div>
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              id="createdAt"
              value={program?.createdAt ? formatDateTime(program.createdAt) : ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <Label htmlFor="updatedAt">Updated At</Label>
            <Input
              id="updatedAt"
              value={program?.updatedAt ? formatDateTime(program.updatedAt) : ""}
              readOnly
              disabled
            />
          </div>

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramEditDialog;
