import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import AdminTopbar from "../admin/AdminTopbar"; // Reuse topbar for consistency

export default function DoctorLayout() {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        // AUTH GUARD: Check if user is logged in and is a doctor
        if (!token || user.role !== "doctor") {
            navigate("/login");
        } else {
            setAuthorized(true);
        }
    }, [navigate]);

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-[#F0F4F8] overflow-x-hidden">
            <DoctorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-8 md:p-10 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
