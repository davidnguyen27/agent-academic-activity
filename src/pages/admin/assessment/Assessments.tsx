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

const AssessmentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
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
        isDelete: deletedFilter,
      })
    );
    setAssessments(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

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

  // useEffect(() => {
  //   if (location.state?.createdSubject) {
  //     setSubjects((prev) => [location.state.createdSubject, ...prev]);
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location.state]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return (
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Assessment Management</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Assessments</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." />
        <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="code">Sort by Code</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setDeletedFilter(value === "true")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Active or Deleted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="destructive" onClick={() => navigate("/admin/assessment/create")}>
          Add a Assessment
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject Code</TableHead>
              <TableHead>Knowledge & Skill</TableHead>
              <TableHead>Grading Guide</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <span className="text-blue-500 animate-pulse">Loading...</span>
                </TableCell>
              </TableRow>
            ) : assessments.length > 0 ? (
              assessments.map((assessment, index) => (
                <TableRow key={assessment.assessmentId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{assessment.category}</TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>{subjectMap.get(assessment.subjectId || "")}</TableCell>
                  <TableCell>{assessment.knowledgeAndSkill}</TableCell>
                  <TableCell>{assessment.gradingGuide}</TableCell>
                  <TableCell>{assessment.note}</TableCell>
                  <TableCell>{assessment.createdAt ? new Date(assessment.createdAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>{assessment.updatedAt ? new Date(assessment.updatedAt).toLocaleString() : "-"}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(assessment.assessmentId)}>
                      <Trash2 size={16} className="cursor-pointer text-red-500" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      className="cursor-pointer text-blue-500"
                      onClick={() => navigate(`/admin/assessment/details?id=${assessment.assessmentId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-400">
                  No assessments found.
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
