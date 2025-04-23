import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToolFormData, toolSchema } from "@/utils/validate/tool.schema";
import { toolService } from "@/services/tool.service";
import { useEffect } from "react";
import { toast } from "sonner";

interface ToolEditDialogProps {
  open: boolean;
  tool: Tool | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ToolEditDialog = ({ open, tool, onOpenChange, onSuccess }: ToolEditDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      toolCode: "",
      toolName: "",
      author: "",
      publisher: "",
      publishedDate: "",
      description: "",
      note: "",
    },
  });

  useEffect(() => {
    if (tool) {
      reset({
        ...tool,
        publishedDate: tool.publishedDate.split("T")[0],
      });
    }
  }, [tool, reset]);

  const onSubmit = async (data: ToolFormData) => {
    try {
      await toolService.updateTool(tool!.toolId, {
        ...data,
        publishedDate: new Date(data.publishedDate).toISOString(),
      });
      toast.success("Tool updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to update tool.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Tool</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="toolCode">Tool Code</Label>
            <Input id="toolCode" {...register("toolCode")} />
            {errors.toolCode && <p className="text-sm text-red-500">{errors.toolCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="toolName">Tool Name</Label>
            <Input id="toolName" {...register("toolName")} />
            {errors.toolName && <p className="text-sm text-red-500">{errors.toolName.message}</p>}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} />
          </div>

          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input id="publisher" {...register("publisher")} />
          </div>

          <div>
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input type="date" id="publishedDate" {...register("publishedDate")} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div>
            <Label htmlFor="note">Note</Label>
            <Input id="note" {...register("note")} />
          </div>

          <div>
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              id="createdAt"
              value={tool?.createdAt ? new Date(tool.createdAt).toLocaleDateString("vi-VN") : ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <Label htmlFor="updatedAt">Updated At</Label>
            <Input
              id="updatedAt"
              value={tool?.updatedAt ? new Date(tool.updatedAt).toLocaleDateString("vi-VN") : ""}
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

export default ToolEditDialog;
