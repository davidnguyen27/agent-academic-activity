import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Network, GitBranch } from "lucide-react";

const features = [
  {
    title: "View Curriculum",
    path: "/user/curriculum",
    icon: BookOpen,
    description: "Browse through your program's curriculum"
  },
  {
    title: "View Syllabus",
    path: "/user/syllabus",
    icon: GraduationCap,
    description: "Access detailed course syllabi"
  },
  {
    title: "View Subjects",
    path: "/user/subject",
    icon: Network,
    description: "Visualize subject learning paths"
  },
  {
    title: "Pre-requisite Subjects",
    path: "/user/prerequisite",
    icon: GitBranch,
    description: "Check subject prerequisites"
  }
];

const UserHome = () => {
  return (
    <div className="container mx-auto p-8">
      <Card className="shadow-md">
        <CardHeader>
          <h3 className="text-2xl font-bold text-[#08c]">Student's Features</h3>
          <p className="text-muted-foreground">Access your academic resources and tools</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={feature.path}
                  to={feature.path}
                  className="group relative"
                >
                  <div className="p-6 h-full rounded-lg border bg-card transition-all duration-200
                               group-hover:border-[#F2994A] group-hover:shadow-md">
                    <div className="flex flex-col gap-4">
                      <Icon className="w-6 h-6 text-[#F2994A]" />
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHome;