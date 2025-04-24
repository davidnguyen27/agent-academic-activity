import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramFormData, programSchema } from "@/utils/validate/program.schema";
import { programService } from "@/services/program.service";
import { toast } from "sonner";

interface ProgramCreateDialogProps {
  onSuccess?: () => void;
}

const ProgramCreateDialog = ({ onSuccess }: ProgramCreateDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
  });

  const onSubmit = async (data: ProgramFormData) => {
    try {
      const finalData = {
        ...data,
        startAt: new Date(data.startAt).toISOString(),
      };
      await programService.createProgram(finalData);
      toast.success("Tool created successfully!");
      reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to create tool.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Add a program</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="programCode">Program Code</Label>
            <Input className="mt-3 mb-2" id="programCode" {...register("programCode")} />
            {errors.programCode && <p className="text-sm text-red-500">{errors.programCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="programName">Program Name</Label>
            <Input className="mt-3 mb-2" id="programName" {...register("programName")} />
            {errors.programName && <p className="text-sm text-red-500">{errors.programName.message}</p>}
          </div>

          <div>
            <Label htmlFor="startAt">Start At</Label>
            <Input type="date" className="mt-3 mb-2" id="startAt" {...register("startAt")} />
            {errors.startAt && <p className="text-sm text-red-500">{errors.startAt.message}</p>}
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramCreateDialog;
