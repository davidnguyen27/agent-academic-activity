import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { materialSchema, MaterialFormData } from "@/utils/validate/material.schema";
import { materialService } from "@/services/material.service";
import { subjectService } from "@/services/subject.service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatDate } from "@/utils/format/date.format";

const EditMaterial = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const materialId = searchParams.get("id");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timestamps, setTimestamps] = useState<{
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
    watch,
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  const subjectId = watch("subjectId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [material, subjectRes] = await Promise.all([
          materialService.getMaterialById(materialId!),
          subjectService.getAllSubjects({ pageSize: 1000 }),
        ]);
        setSubjects(subjectRes.items);
        reset(material);

        setTimestamps({
          createdAt: material.createdAt,
          updatedAt: material.updatedAt,
          deletedAt: material.deletedAt,
        });
      } catch {
        toast.error("Failed to load material or subject list.");
      }
    };

    if (materialId) fetchData();
  }, [materialId, reset]);

  const onSubmit = async (data: MaterialFormData) => {
    try {
      await materialService.updateMaterial(materialId!, data);
      toast.success("Material updated successfully!");
      navigate("/admin/material");
    } catch {
      toast.error("Failed to update material.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">Edit Material</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
        {/* Text Inputs */}
        {[
          { label: "Material Code", name: "materialCode" },
          { label: "Material Name", name: "materialName" },
          { label: "Author", name: "author" },
          { label: "Publisher", name: "publisher" },
          { label: "Published Date", name: "publishedDate", type: "datetime-local" },
          { label: "Edition", name: "edition" },
          { label: "ISBN", name: "isbn" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              type={type || "text"}
              placeholder={`Enter ${label.toLowerCase()}...`}
              {...register(name as keyof MaterialFormData)}
              className="mt-1"
            />
            {errors[name as keyof MaterialFormData] && (
              <p className="text-sm text-red-500 mt-1">{errors[name as keyof MaterialFormData]?.message as string}</p>
            )}
          </div>
        ))}

        {/* Textareas */}
        <div className="md:col-span-2">
          <Label htmlFor="materialDescription">Description</Label>
          <Textarea
            id="materialDescription"
            rows={3}
            placeholder="Enter material description..."
            {...register("materialDescription")}
          />
          {errors.materialDescription && (
            <p className="text-sm text-red-500 mt-1">{errors.materialDescription.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" rows={2} placeholder="Enter note (optional)..." {...register("note")} />
          {errors.note && <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>}
        </div>

        {/* Switches */}
        {[
          { label: "Is Main Material", name: "isMainMaterial" },
          { label: "Is Hard Copy", name: "isHardCopy" },
          { label: "Is Online", name: "isOnline" },
        ].map(({ label, name }) => (
          <div key={name}>
            <Label>{label}</Label>
            <Controller
              control={control}
              name={name as keyof MaterialFormData}
              render={({ field }) => <Switch checked={!!field.value} onCheckedChange={field.onChange} />}
            />
          </div>
        ))}

        {/* Subject Select */}
        <div className="md:col-span-2">
          <Label htmlFor="subjectId">Subject</Label>
          <Select value={subjectId} onValueChange={(value) => setValue("subjectId", value)}>
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

        {/* Timestamps */}
        <div className="md:col-span-2 text-sm text-gray-500 space-y-1">
          {timestamps.createdAt && <p>Created At: {formatDate(timestamps.createdAt)}</p>}
          {timestamps.updatedAt && <p>Updated At: {formatDate(timestamps.updatedAt)}</p>}
          {timestamps.deletedAt && <p>Deleted At: {formatDate(timestamps.deletedAt)}</p>}
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating..." : "Update Material"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterial;
