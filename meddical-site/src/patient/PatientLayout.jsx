import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import AdminTopbar from "../admin/AdminTopbar";

export default function PatientLayout() {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        // AUTH GUARD: Check if user is logged in and is a patient
        if (!token || user.role !== "patient") {
            navigate("/login");
        } else {
            setAuthorized(true);
        }
    }, [navigate]);

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
            <PatientSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
