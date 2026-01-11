import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // ===============================
  // Detect scroll to activate sticky
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full bg-[#01075C] text-white shadow-md z-50 transition-all duration-300
        ${isSticky ? "fixed top-0 left-0" : "relative"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-2xl font-bold">
          <Link to="/">🏥</Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/about" className="hover:text-blue-300">About</Link>
          <Link to="/services" className="hover:text-blue-300">Services</Link>
          <Link to="/doctors" className="hover:text-blue-300">Doctors</Link>
          <Link to="/news" className="hover:text-blue-300">News</Link>
          <Link to="/contact" className="hover:text-blue-300">Contact</Link>
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          <Link to="/appointment">
            <button className="hidden md:block bg-blue-500 px-5 py-2 rounded-full hover:bg-blue-600">
              Appointment
            </button>
          </Link>

          <Link to="/login">
            <button className="hidden md:block bg-blue-500 px-5 py-2 rounded-full hover:bg-blue-600">
              Login
            </button>
          </Link>

          {/* MOBILE MENU */}
          <div
            className="md:hidden text-3xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div className="md:hidden bg-[#020A70] px-6 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</Link>
          <Link to="/news" onClick={() => setMenuOpen(false)}>News</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          <Link to="/appointment">
            <button className="w-full bg-blue-500 py-2 rounded-full">
              Appointment
            </button>
          </Link>

          <Link to="/login">
            <button className="w-full bg-blue-500 py-2 rounded-full">
              Login
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
