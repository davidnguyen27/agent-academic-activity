import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { Search, FileText, Home } from "lucide-react";

const mockCurriculum = [
  {
    curriculumId: "1",
    curriculumCode: "CURR001",
    curriculumName: "Software Engineering 2024",
    decisionNo: "QD-2024-001",
    isActive: true,
  },
  {
    curriculumId: "2",
    curriculumCode: "CURR002",
    curriculumName: "Artificial Intelligence 2023",
    decisionNo: "QD-2023-012",
    isActive: false,
  },
  {
    curriculumId: "3",
    curriculumCode: "CURR003",
    curriculumName: "Information Systems 2022",
    decisionNo: "QD-2022-045",
    isActive: true,
  },
];

const ListCurriculum = () => {
  const currentPage = 1;
  const totalPages = 1;

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/home">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Curriculum</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Curriculum List</h2>
              <p className="text-muted-foreground">Browse and search through available Curriculum</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Curriculum..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Majors</SelectItem>
                <SelectItem value="se">Software Engineering</SelectItem>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="is">Information Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Decision No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCurriculum.map((curriculum) => (
                  <TableRow key={curriculum.curriculumId}>
                    <TableCell className="font-medium">{curriculum.curriculumCode}</TableCell>
                    <TableCell>{curriculum.curriculumName}</TableCell>
                    <TableCell>{curriculum.decisionNo}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${curriculum.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {curriculum.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/curriculum/${curriculum.curriculumId}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCurriculum;
