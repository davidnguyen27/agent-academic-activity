import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialSchema, MaterialFormData } from "@/utils/validate/material.schema";
import { materialService } from "@/services/material.service";
import { subjectService } from "@/services/subject.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const CreateMaterial = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => setSubjects(res.items));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    reset,
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      isMainMaterial: true,
      isHardCopy: false,
      isOnline: false,
    },
  });

  const onSubmit = async (data: MaterialFormData) => {
    try {
      await materialService.createMaterial(data);
      toast.success("Material created successfully!");
      navigate("/admin/material");
      reset();
    } catch {
      toast.error("Failed to create material");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 border-b pb-2">Create New Material</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Material Code + Name */}
        <div>
          <Label htmlFor="materialCode">Material Code</Label>
          <Input id="materialCode" {...register("materialCode")} />
          {errors.materialCode && <p className="text-sm text-red-500 mt-1">{errors.materialCode.message}</p>}
        </div>

        <div>
          <Label htmlFor="materialName">Material Name</Label>
          <Input id="materialName" {...register("materialName")} />
          {errors.materialName && <p className="text-sm text-red-500 mt-1">{errors.materialName.message}</p>}
        </div>

        {/* Row 2: Description (full width) */}
        <div className="col-span-2">
          <Label htmlFor="materialDescription">Description</Label>
          <Textarea id="materialDescription" {...register("materialDescription")} rows={3} />
          {errors.materialDescription && (
            <p className="text-sm text-red-500 mt-1">{errors.materialDescription.message}</p>
          )}
        </div>

        {/* Row 3: Author + Publisher */}
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} />
          {errors.author && <p className="text-sm text-red-500 mt-1">{errors.author.message}</p>}
        </div>

        <div>
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" {...register("publisher")} />
          {errors.publisher && <p className="text-sm text-red-500 mt-1">{errors.publisher.message}</p>}
        </div>

        {/* Row 4: Published Date + Edition */}
        <div>
          <Label htmlFor="publishedDate">Published Date</Label>
          <Input id="publishedDate" type="datetime-local" {...register("publishedDate")} />
          {errors.publishedDate && <p className="text-sm text-red-500 mt-1">{errors.publishedDate.message}</p>}
        </div>

        <div>
          <Label htmlFor="edition">Edition</Label>
          <Input id="edition" {...register("edition")} />
          {errors.edition && <p className="text-sm text-red-500 mt-1">{errors.edition.message}</p>}
        </div>

        {/* Row 5: ISBN + Note (note full width) */}
        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" {...register("isbn")} />
          {errors.isbn && <p className="text-sm text-red-500 mt-1">{errors.isbn.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" {...register("note")} rows={2} />
          {errors.note && <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>}
        </div>

        {/* Row 6: Switches */}
        <div>
          <Label>Is Main Material</Label>
          <Controller
            control={control}
            name="isMainMaterial"
            render={({ field }) => (
              <div className="mt-2">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </div>

        <div>
          <Label>Is Hard Copy</Label>
          <Controller
            control={control}
            name="isHardCopy"
            render={({ field }) => (
              <div className="mt-2">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </div>

        <div>
          <Label>Is Online</Label>
          <Controller
            control={control}
            name="isOnline"
            render={({ field }) => (
              <div className="mt-2">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </div>

        {/* Row 7: Subject Dropdown */}
        <div className="md:col-span-2">
          <Label htmlFor="subjectId">Subject</Label>
          <Select onValueChange={(value) => setValue("subjectId", value)} defaultValue="">
            <SelectTrigger>
              <SelectValue placeholder="Select a subject..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && <p className="text-sm text-red-500 mt-1">{errors.subjectId.message}</p>}
        </div>

        {/* Row 8: Actions */}
        <div className="md:col-span-2 flex justify-end mt-4">
          <Button type="submit" disabled={isSubmitting} className="px-6">
            {isSubmitting ? "Creating..." : "Create Material"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterial;
