import { useCallback, useEffect, useState } from "react";
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
import { formatDateTime } from "@/utils/format/date-time.format";
import { Badge } from "@/components/ui/badge";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { TableSkeleton } from "@/components/common/TableSkeleton";

const SubjectManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchSubjects = useCallback(async () => {
    const res = await startLoading(() =>
      subjectService.getAllSubjects({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setSubjects(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await subjectService.getSubjectById(id);
      setSelectedSubject(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load subject details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await subjectService.deleteSubject(id);
      toast.success("Curriculum deleted successfully!");
      await fetchSubjects();
    } catch {
      toast.error("Failed to delete subject");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedSubject?.subjectId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedSubject(null);
    }
  }, [location.search, openDetail, selectedSubject, handleOpenDetail]);

  useEffect(() => {
    if (location.state?.createdSubject) {
      setSubjects((prev) => [location.state.createdSubject, ...prev]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subject Management</h1>
      </div>

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Subjects</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filter Panel */}
      <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
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

        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/subject/prerequisite")}>
            Prerequisite Overview
          </Button>

          <Button variant="outline" onClick={() => navigate("/admin/subject/clo-list")}>
            CLO Overview
          </Button>

          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/admin/subject/create")}
          >
            + Add a Subject
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center whitespace-nowrap">#</TableHead>
              <TableHead className="whitespace-nowrap">Code</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Approved Date</TableHead>
              <TableHead className="whitespace-nowrap">Syllabus</TableHead>
              <TableHead className="whitespace-nowrap">Decision No</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="text-center whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={8} />
            ) : subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="text-center whitespace-nowrap">{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap max-w-[150px] truncate">{subject.subjectCode}</TableCell>
                  <TableCell className="whitespace-nowrap max-w-[200px] truncate">{subject.subjectName}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDateTime(subject.approvedDate)}</TableCell>
                  <TableCell className="whitespace-nowrap max-w-[180px] truncate">{subject.syllabusName}</TableCell>
                  <TableCell className="whitespace-nowrap max-w-[160px] truncate">{subject.decisionNo}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={subject.isApproved ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}
                    >
                      {subject.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap space-x-3">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(subject.subjectId)}>
                      <Trash2 className="inline-block text-red-500 hover:text-red-600 cursor-pointer" size={18} />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      className="inline-block text-blue-500 hover:text-blue-600 cursor-pointer"
                      size={18}
                      onClick={() => navigate(`/admin/subject/details?id=${subject.subjectId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptySearchResult />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 pt-4">
        <Pagination>
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

export default SubjectManagement;
