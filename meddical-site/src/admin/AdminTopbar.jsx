import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ onToggle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Senior Administrator';
      case 'doctor': return 'Chief Medical Officer';
      case 'patient': return 'Valued Patient';
      default: return 'Authorized User';
    }
  };

  return (
    <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">

      {/* Mobile Menu & Search Row */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggle}
          className="lg:hidden w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Search Bar - Aesthetic only */}
        <div className="hidden lg:flex items-center gap-4 bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl w-96 group focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-200 transition-all">
          <span className="text-gray-400 font-bold">🔍</span>
          <input
            type="text"
            placeholder="Search dashboard..."
            className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-4 md:gap-8">

        {/* Notifications */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <span className="text-2xl grayscale group-hover:grayscale-0">🔔</span>
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-gray-100 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-blue-600/40 uppercase tracking-widest leading-none mb-1">Authenticated</p>
            <p className="text-sm font-extrabold text-[#1F2B6C] group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name || "User"}</p>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">{getRoleLabel(user.role)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 group-hover:bg-[#1F2B6C] rounded-2xl flex items-center justify-center text-[#1F2B6C] group-hover:text-white font-extrabold shadow-sm transition-all duration-300">
            {user.name ? user.name.charAt(0) : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
