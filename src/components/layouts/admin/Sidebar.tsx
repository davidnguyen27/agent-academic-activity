import { useState } from "react";
import {
  GraduationCap,
  Menu,
  BookOpenText,
  Archive,
  Settings2,
  Brain,
  LayoutDashboard,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Students", icon: GraduationCap, to: "/admin/student" },
  { label: "Subjects", icon: BookOpenText, to: "/admin/subject" },
  { label: "Curriculums", icon: ScrollText, to: "/admin/curriculum" },
  { label: "Materials", icon: Archive, to: "/admin/material" },
  { label: "Tools", icon: Settings2, to: "/admin/tool" },
  { label: "Program", icon: Brain, to: "/admin/program" },
];

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 text-white p-4 transition-all duration-300 
      ${collapsed ? "w-[80px]" : "w-[250px]"}`}
    >
      <div className="flex items-center justify-between mb-10">
        <h2
          className={`text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
        >
          Academic
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-blue-500"
        >
          <Menu size={24} />
        </Button>
      </div>

      <TooltipProvider>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.to);
            const linkContent = (
              <Link
                key={item.label}
                to={item.to}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive ? "bg-white text-blue-600 shadow-md" : "hover:bg-blue-300/30 hover:text-white"
                } ${collapsed ? "justify-center" : "gap-4 justify-start"}`}
              >
                <item.icon
                  className={`w-6 h-6 min-w-[24px] transform transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-blue-600" : ""
                  }`}
                />
                <span
                  className={`overflow-hidden transition-all duration-300 ${
                    collapsed ? "w-0 opacity-0" : "w-full opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              linkContent
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
};

export default SideBar;
