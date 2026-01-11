import { Link, useLocation, useNavigate } from "react-router-dom";

export default function PatientSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "My Health Hub", path: "/patient/dashboard", icon: "🏠" },
        { name: "My Appointments", path: "/patient/appointments", icon: "📅" },
        { name: "Prescriptions", path: "/patient/prescriptions", icon: "💊" },
        { name: "Medical Reports", path: "/patient/reports", icon: "📄" },
        { name: "Billing History", path: "/patient/billing", icon: "🧾" },
        { name: "Account Profile", path: "/patient/profile", icon: "👤" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-gray-100 flex flex-col h-screen z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-2xl`}>
                <div className="p-10 border-b border-gray-50 relative">
                    <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-[#1F2B6C]">
                        <span className="text-4xl text-blue-600">🏥</span> MyHealth
                    </h2>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden absolute top-8 right-8 text-gray-400 hover:text-[#1F2B6C]">
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
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-200"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-[#1F2B6C]"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-red-400 hover:bg-red-50 transition-all font-black uppercase text-xs tracking-widest"
                    >
                        <span>👋</span> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
