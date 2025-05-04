import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BadgeInfo, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { subjectService } from "@/services/subject.service";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { assessmentService } from "@/services/assessment.service";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const AssessmentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  // Tạo Map subjectId -> subjectCode
  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((a) => map.set(a.subjectId, a.subjectCode));
    return map;
  }, [subjects]);

  // Gọi danh sách subject một lần
  useEffect(() => {
    subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => {
      setSubjects(res.items);
    });
  }, []);

  // Gọi danh sách assessments
  const fetchAssessments = useCallback(async () => {
    const res = await startLoading(() =>
      assessmentService.getAllAssessments({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setAssessments(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await assessmentService.getAssessmentById(id);
      setSelectedAssessment(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load assessment details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await assessmentService.deleteAssessment(id);
      toast.success("Assessment deleted successfully!");
      await fetchAssessments();
    } catch {
      toast.error("Failed to delete assessment");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedAssessment?.assessmentId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedAssessment(null);
    }
  }, [location.search, openDetail, selectedAssessment, handleOpenDetail]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return (
    <div className="bg-white p-6 shadow-md rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800">Assessment Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject">Subjects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject/clo-list">CLOs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Assessments</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category"
            className="w-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort By</label>
          <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")} defaultValue="default">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort Type</label>
          <Select onValueChange={(value) => setSortType(value as "Ascending" | "Descending")} defaultValue="Ascending">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ascending">Ascending</SelectItem>
              <SelectItem value="Descending">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select onValueChange={(value) => setDeletedFilter(value === "true")} defaultValue="false">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/admin/subject/clo-list/assessment/create")}
          >
            + Add a Assessment
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-12 text-center">No.</TableHead>
              <TableHead className="w-40 truncate">Category</TableHead>
              <TableHead className="w-40 truncate">Type</TableHead>
              <TableHead className="w-48 truncate">Subject Code</TableHead>
              <TableHead className="w-64 truncate">Knowledge & Skill</TableHead>
              <TableHead className="w-64 truncate">Grading Guide</TableHead>
              <TableHead className="w-64 truncate">Note</TableHead>
              <TableHead className="w-48 text-center">Created At</TableHead>
              <TableHead className="w-48 text-center">Updated At</TableHead>
              <TableHead className="w-32 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={10} />
            ) : assessments.length > 0 ? (
              assessments.map((assessment, index) => (
                <TableRow key={assessment.assessmentId}>
                  <TableCell className="text-center">{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{assessment.category}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{assessment.type}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{subjectMap.get(assessment.subjectId || "")}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{assessment.knowledgeAndSkill}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{assessment.gradingGuide}</TableCell>
                  <TableCell className="truncate max-w-[80px]">{assessment.note}</TableCell>
                  <TableCell className="text-center truncate">
                    {assessment.createdAt ? new Date(assessment.createdAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="text-center truncate">
                    {assessment.updatedAt ? new Date(assessment.updatedAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(assessment.assessmentId)}>
                      <Trash2 size={16} className="cursor-pointer text-red-500" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      className="cursor-pointer text-blue-500"
                      onClick={() =>
                        navigate(`/admin/subject/clo-list/assessment/details?id=${assessment.assessmentId}`)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>
                  <EmptySearchResult />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex mt-8">
        <Pagination className="ml-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(p - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AssessmentManagement;
