import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useLoading } from "@/hooks/useLoading";
import { useDebounce } from "@/hooks/useDebounce";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const StudentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchStudents = useCallback(async () => {
    const res = await startLoading(() =>
      studentService.getAllStudents({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        isDelete: deletedFilter,
      })
    );
    setStudents(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await studentService.getStudentById(id);
      setSelectedStudent(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load major details");
    }
  }, []);

  const handleDeleteStudent = async (id: string) => {
    try {
      await studentService.deleteStudent(id);
      toast.success("Major deleted successfully!");
      await fetchStudents();
    } catch {
      toast.error("Failed to delete major. Try again later.");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    if (id && (!openDetail || selectedStudent?.userId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedStudent(null);
    }
  }, [location.search, openDetail, selectedStudent, handleOpenDetail]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Manage Students</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Students</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            onClick={() => navigate("/admin/subject/create")}
          >
            + Add a Subject
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableSkeleton columns={9} />
              </TableRow>
            ) : students.length > 0 ? (
              students.map((student, i) => (
                <TableRow key={student.userId} className="hover:bg-blue-50 transition">
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell className="max-w-[100px] truncate">{student.studentCode}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{student.fullName}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{student.email}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{student.address}</TableCell>
                  <TableCell>{new Date(student.dob || "").toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Trash2
                      size={16}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => handleDeleteStudent(student.userId!)}
                    />
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => navigate(`?id=${student.userId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
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

export default StudentManagement;
