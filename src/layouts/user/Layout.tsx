import UserSidebar from "@/components/layouts/user/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Settings, Globe, Moon, Sun } from "lucide-react";

export default function UserLayout() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getPageTitle = () => {
    if (location.pathname.startsWith("/chat")) {
      return "Chat with AI";
    }
    return "Agent Chat 1.0";
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-[#f7f7f8] dark:bg-[#1e1e1e] transition-all duration-300">
      <UserSidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white/90 dark:bg-[#2c2c2c]/90 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
              title="Change Language"
            >
              <Globe className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => alert("Settings popup (future feature)")}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-200 transition-all duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
