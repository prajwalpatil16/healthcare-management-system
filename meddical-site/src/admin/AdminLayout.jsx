import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    // AUTH GUARD: Check if user is logged in and is an admin
    if (!token || user.role !== "admin") {
      navigate("/login");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-8 md:p-12 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
