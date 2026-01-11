import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DoctorSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "Clinical Overview", path: "/doctor/dashboard", icon: "📊" },
        { name: "My Appointments", path: "/doctor/appointments", icon: "📅" },
        { name: "Patients Registry", path: "/doctor/patients", icon: "👥" },
        { name: "Medical Records", path: "/doctor/records", icon: "📁" },
        { name: "Billing & Fees", path: "/doctor/billing", icon: "💳" },
        { name: "Profile Settings", path: "/doctor/profile", icon: "⚙️" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-[#1F2B6C]/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#1F2B6C] text-white flex flex-col h-screen z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-2xl`}>
                <div className="p-10 border-b border-white/5 relative">
                    <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                        <span className="text-4xl">🧑‍⚕️</span> Clinical Portal
                    </h2>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden absolute top-8 right-8 text-blue-300 hover:text-white">
                        ✕
                    </button>
                </div>

                <nav className="flex-1 px-8 py-10 space-y-3 overflow-y-auto">
                    {menu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && onClose()}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-2"
                                    : "text-blue-100/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
