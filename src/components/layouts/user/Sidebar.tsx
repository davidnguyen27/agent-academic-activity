import { useState, useEffect } from "react";
import { Plus, ChevronsLeft, ChevronsRight, X, BookOpenText, GraduationCap, Layers, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalUser from "./ModalUser";
// import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/services/chat.service";
import { toast } from "sonner";
import { useChatSession } from "@/contexts/ChatSessionContext";

export default function UserSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Student | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<
    {
      id: string;
      title: string;
      type: "Default" | "Subject" | "Major" | "Program" | "Combo";
    }[]
  >([]);

  // const { user } = useAuth();
  const { reloadToken } = useChatSession();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const fetchAllTopics = async () => {
    const topics: ("Default" | "Subject" | "Major" | "Program" | "Combo")[] = [
      "Default",
      "Subject",
      "Major",
      "Program",
      "Combo",
    ];

    try {
      setLoading(true);
      const allSessions = await Promise.all(
        topics.map((topic) =>
          sessionService.getAllSessions({
            pageNumber: 1,
            pageSize: 100,
            isDelete: false,
            topicChat: topic,
          })
        )
      );

      const merged = allSessions.flatMap((res, index) =>
        res.items.map((item: Session) => ({
          id: item.aiChatLogId,
          title: item.aiChatLogName,
          type: topics[index],
        }))
      );

      setSessions(merged);
    } catch (err) {
      console.error("[fetchAllTopics] Error:", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, [reloadToken]);

  const handleNewChatByType = async (type: "Default" | "Subject" | "Major" | "Program" | "Combo") => {
    try {
      const firstMessage = "Tư vấn giúp mình về chủ đề này";

      const response = await sessionService.createSession({
        content: firstMessage,
        topic: type,
      });

      const aiChatLog = response.aiChatLog;

      // ✅ Thêm session mới vào danh sách hiện tại (không gọi lại API)
      setSessions((prev) => [
        {
          id: aiChatLog.aiChatLogId,
          title: aiChatLog.aiChatLogName,
          type,
        },
        ...prev,
      ]);

      navigate(`/user/chat/${aiChatLog.aiChatLogId}`, {
        state: { topic: type, firstMessage },
      });
    } catch (err) {
      console.error("[handleNewChatByType] Error:", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this session?");
    if (!confirmed) return;

    try {
      await sessionService.deleteSession(id);

      setSessions((prev) => prev.filter((session) => session.id !== id));

      // if (location.pathname === `/user/chat/${id}`) {
      //   navigate("/user/chat", { replace: true });
      // }
      navigate("/user/chat", { replace: true });
      window.location.reload();
      toast.success("Session deleted successfully!");
    } catch {
      toast.error("Failed to delete session! Please try again.");
    }
  };

  const iconMap = {
    Default: <Plus className="h-4 w-4" />,
    Subject: <BookOpenText className="h-4 w-4" />,
    Major: <GraduationCap className="h-4 w-4" />,
    Program: <Layers className="h-4 w-4" />,
    Combo: <Settings2 className="h-4 w-4" />,
  };

  return (
    <>
      <aside
        className={`h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 text-white p-4 transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-2 border border-white/20 rounded-md hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </button>

          <div className="flex flex-col gap-2">
            {(["Default", "Subject", "Major", "Program", "Combo"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleNewChatByType(type)}
                className="flex items-center justify-center p-2 border border-white/20 rounded-md hover:bg-white/10 transition gap-2"
              >
                {iconMap[type]}
                {!collapsed && <span>{type} Chat</span>}
              </button>
            ))}
          </div>

          <nav className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
            {loading ? (
              <div className="text-sm text-white/70 text-center py-4">Loading sessions...</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center justify-between bg-white/10 hover:bg-white/20 transition p-2 rounded-md"
                >
                  <button
                    onClick={() => {
                      setNavigatingId(session.id);
                      navigate(`/user/chat/${session.id}`);
                    }}
                    className={`flex items-center ${collapsed ? "justify-center" : "justify-start gap-3"} flex-1`}
                    disabled={navigatingId === session.id}
                  >
                    {!collapsed && (
                      <div className="w-6 h-6 flex items-center justify-center">{iconMap[session.type]}</div>
                    )}
                    <div className="truncate text-sm">
                      {collapsed ? null : navigatingId === session.id ? "Loading..." : session.title}
                    </div>
                  </button>

                  {!collapsed && (
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </nav>
        </div>

        <div
          onClick={() => setOpenProfile(true)}
          className={`flex items-center p-3 rounded-md hover:bg-white/10 transition cursor-pointer ${
            collapsed ? "justify-center" : "gap-3 justify-start"
          }`}
        >
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img
              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{user?.studentCode}</p>
              <p className="text-xs text-white/70">View Profile</p>
            </div>
          )}
        </div>
      </aside>

      <ModalUser open={openProfile} onOpenChange={setOpenProfile} user={user} />
    </>
  );
}
