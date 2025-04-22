import { Bell, Mail, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = {
    name: "Nguyễn Hoàng",
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/authentication");
  };

  return (
    <header className="bg-white px-6 py-4 shadow">
      <div className="flex justify-end items-center gap-6">
        <Mail className="text-gray-600 cursor-pointer" />
        <Bell className="text-gray-600 cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <UserCircle className="text-gray-600 cursor-pointer w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mt-2">
            <div className="px-3 py-2 text-sm font-medium border-b text-gray-700">{user.name}</div>
            <DropdownMenuItem className="text-red-500 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
