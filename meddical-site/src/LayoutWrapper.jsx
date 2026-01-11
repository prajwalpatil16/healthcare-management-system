// LayoutWrapper.jsx
import { useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/doctor/") ||
    location.pathname === "/doctor" ||
    location.pathname.startsWith("/patient/") ||
    location.pathname === "/patient";

  return (
    <>
      {!hideLayout && <TopBar />}
      {!hideLayout && <Header />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}
