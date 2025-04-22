import { useState } from "react";
import { Link } from "react-router-dom";
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
import { BadgeInfo, CirclePlus, Trash2 } from "lucide-react";

const CurriculumManagement = () => {
  const [page, setPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Curriculums</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Curriculums</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Input placeholder="Search by name..." />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Sort descending by code</SelectItem>
            <SelectItem value="2">Sort ascending by name</SelectItem>
            <SelectItem value="3">Disapproved</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="destructive" className="flex items-center gap-2">
          <CirclePlus size={20} color="white" />
          Add a curriculum
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Decision No</TableHead>
              <TableHead>Pre-requisites</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>IsApproved</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i} className="hover:bg-blue-50">
                <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                <TableCell>SWP391</TableCell>
                <TableCell>Software Development Project</TableCell>
                <TableCell>Project-based course</TableCell>
                <TableCell>DEC1234</TableCell>
                <TableCell>PRJ301</TableCell>
                <TableCell>SE</TableCell>
                <TableCell>{i % 2 === 0 ? "Yes" : "No"}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Trash2 size={16} color="red" className="cursor-pointer" />
                  <BadgeInfo size={16} color="blue" className="cursor-pointer" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex mt-8">
        <Pagination className="ml-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CurriculumManagement;
