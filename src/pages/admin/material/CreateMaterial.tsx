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
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Create Material</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="materialCode">Material Code</Label>
          <Input id="materialCode" {...register("materialCode")} />
          {errors.materialCode && <p className="text-sm text-red-500">{errors.materialCode.message}</p>}
        </div>

        <div>
          <Label htmlFor="materialName">Material Name</Label>
          <Input id="materialName" {...register("materialName")} />
          {errors.materialName && <p className="text-sm text-red-500">{errors.materialName.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="materialDescription">Description</Label>
          <Textarea id="materialDescription" {...register("materialDescription")} rows={3} />
          {errors.materialDescription && <p className="text-sm text-red-500">{errors.materialDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} />
          {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
        </div>

        <div>
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" {...register("publisher")} />
          {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
        </div>

        <div>
          <Label htmlFor="publishedDate">Published Date</Label>
          <Input id="publishedDate" type="datetime-local" {...register("publishedDate")} />
          {errors.publishedDate && <p className="text-sm text-red-500">{errors.publishedDate.message}</p>}
        </div>

        <div>
          <Label htmlFor="edition">Edition</Label>
          <Input id="edition" {...register("edition")} />
          {errors.edition && <p className="text-sm text-red-500">{errors.edition.message}</p>}
        </div>

        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" {...register("isbn")} />
          {errors.isbn && <p className="text-sm text-red-500">{errors.isbn.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" {...register("note")} rows={2} />
          {errors.note && <p className="text-sm text-red-500">{errors.note.message}</p>}
        </div>

        <div>
          <Label>Is Main Material</Label>
          <Controller
            control={control}
            name="isMainMaterial"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div>
          <Label>Is Hard Copy</Label>
          <Controller
            control={control}
            name="isHardCopy"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div>
          <Label>Is Online</Label>
          <Controller
            control={control}
            name="isOnline"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

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
          {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Material"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterial;
