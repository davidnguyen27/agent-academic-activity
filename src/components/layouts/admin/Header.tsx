import { Bell, Mail, UserCircle, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = today.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className="bg-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Left - Welcome + Date */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">Welcome back, Admin</h1>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-6">
          {/* Quick Action button */}
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg px-4 py-2 transition-all">
            <PlusCircle className="w-4 h-4" />
            New
          </Button>

          {/* Notification icons */}
          <div className="relative">
            <Mail className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors cursor-pointer" />
          </div>
          <div className="relative">
            <Bell className="text-gray-600 w-6 h-6 hover:text-blue-600 transition-colors cursor-pointer" />
          </div>

          {/* User Menu with Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <UserCircle className="text-gray-600 w-8 h-8 hover:text-blue-600 transition-colors cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 mt-2 rounded-lg shadow-lg bg-white">
                    <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Admin</div>
                    <DropdownMenuItem
                      className="text-gray-700 hover:bg-blue-50 cursor-pointer font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="animate-fade-in">
                User Menu
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
