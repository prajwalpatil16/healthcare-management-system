import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const menu = [
    { title: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { title: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
    { title: "Patients", path: "/admin/patients", icon: "👥" },
    { title: "Appointments", path: "/admin/appointments", icon: "📅" },
    { title: "News", path: "/admin/news", icon: "📰" },
    { title: "Feedback", path: "/admin/feedback", icon: "⭐" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#1F2B6C] text-white flex flex-col h-screen z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-2xl`}>

        {/* Brand Header */}
        <div className="p-10 text-center border-b border-white/5 relative">
          <h2 className="text-3xl font-extrabold tracking-tighter">Meddical<span className="text-blue-400">.</span>Admin</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-300/80 mt-2">Professional Care System</p>

          {/* Mobile Close Button */}
          <button onClick={onClose} className="lg:hidden absolute top-8 right-8 text-blue-300 hover:text-white">
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-8 py-10 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-blue-300/50 uppercase tracking-[0.2em] mb-6 px-4">Main Menu</p>
          {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                  ? "bg-white text-[#1F2B6C] shadow-xl shadow-black/10 font-bold"
                  : "hover:bg-white/5 text-blue-100 hover:text-white"
                  }`}
              >
                <span className={`text-xl transition-transform duration-300 ${isActive ? "" : "group-hover:scale-125"}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.title}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Section */}
        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-blue-200 font-bold transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform font-black uppercase text-xs tracking-widest">Secure Logout</span>
            <span className="text-lg">➔</span>
          </button>
        </div>

      </aside>
    </>
  );
}
