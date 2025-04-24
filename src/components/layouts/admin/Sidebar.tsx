import { useState } from "react";
import {
  GraduationCap,
  Menu,
  BookOpenText,
  Archive,
  Layers,
  Settings2,
  Brain,
  LayoutDashboard,
  ScrollText,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Students", icon: GraduationCap, to: "/admin/student" },
  { label: "Subjects", icon: BookOpenText, to: "/admin/subject" },
  { label: "Curriculums", icon: ScrollText, to: "/admin/curriculum" },
  { label: "Assessments", icon: ClipboardList, to: "/admin/assessment" },
  { label: "Materials", icon: Archive, to: "/admin/material" },
  { label: "Tools", icon: Settings2, to: "/admin/tool" },
  { label: "Majors", icon: Layers, to: "/admin/major" },
  { label: "Program", icon: Brain, to: "/admin/program" },
  { label: "Combo", icon: Brain, to: "/admin/combo" },
];

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className={`h-screen bg-blue-500 text-white p-3 transition-all duration-300 ${collapsed ? "w-17" : "w-56"}`}>
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
        >
          Academic Activity
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-blue-500"
        >
          <Menu size={20} />
        </Button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all
                ${isActive ? "bg-white text-blue-600 font-semibold" : "hover:bg-white hover:text-blue-600"}
              `}
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              <span
                className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  collapsed ? "w-0 opacity-0" : "w-full opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
