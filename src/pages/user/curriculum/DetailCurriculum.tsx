import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Book, GraduationCap } from "lucide-react";


const DetailCurriculum = () => {
  const { id } = useParams();
  const [curriculum, setCurriculum] = useState<Curriculum>();
  const [plos, setPlos] = useState<PLO[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with actual API calls
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch curriculum details
        // Fetch PLOs
        // Fetch subjects
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user/home">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user/curriculum">Curriculum</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Details</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold my-6">Curriculum Details</h1>

      {/* Basic Information */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span className="font-semibold">Curriculum Code:</span>
              <span>{curriculum?.curriculumCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{curriculum?.curriculumName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Decision No:</span>
              <span>{curriculum?.decisionNo}</span>
            </div>
            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-2 whitespace-pre-line">{curriculum?.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLOs */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Program Learning Outcomes</h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">PLO Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plos.map((plo) => (
                <TableRow key={plo.id}>
                  <TableCell className="font-medium">{plo.name}</TableCell>
                  <TableCell>{plo.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Subjects</h2>
            </div>
            <Button variant="outline" asChild>
              <Link to={`/user/curriculum/${id}/mapping`}>
                View PLO Mapping
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Pre-Requisite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.subjectCode}>
                  <TableCell className="font-medium">
                    <Link 
                      to={`/user/subject/${subject.subjectCode}`}
                      className="text-blue-600 hover:underline"
                    >
                      {subject.subjectCode}
                    </Link>
                  </TableCell>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell>{subject.noCredit}</TableCell>
                  <TableCell>{subject.preRequisite || 'None'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailCurriculum;