import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToolFormData, toolSchema } from "@/utils/validate/tool.schema";
import { toolService } from "@/services/tool.service";
import { toast } from "sonner";

interface ToolCreateDialogProps {
  onSuccess?: () => void;
}

export default function ToolCreateDialog({ onSuccess }: ToolCreateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
  });

  const onSubmit = async (data: ToolFormData) => {
    try {
      const finalData = {
        ...data,
        publishedDate: new Date(data.publishedDate).toISOString(),
      };
      await toolService.createTool(finalData);
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ Add a tool</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="toolCode">Tool Code</Label>
            <Input className="mt-3 mb-2" id="toolCode" {...register("toolCode")} />
            {errors.toolCode && <p className="text-sm text-red-500">{errors.toolCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="toolName">Tool Name</Label>
            <Input className="mt-3 mb-2" id="toolName" {...register("toolName")} />
            {errors.toolName && <p className="text-sm text-red-500">{errors.toolName.message}</p>}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input className="mt-3 mb-2" id="author" {...register("author")} />
          </div>

          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input className="mt-3 mb-2" id="publisher" {...register("publisher")} />
          </div>

          <div>
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input type="date" className="mt-3 mb-2" id="publishedDate" {...register("publishedDate")} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input className="mt-3 mb-2" id="description" {...register("description")} />
          </div>

          <div>
            <Label htmlFor="note">Note</Label>
            <Input className="mt-3 mb-2" id="note" {...register("note")} />
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
}
