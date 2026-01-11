// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout wrapper (shows/hides header/footer)
import LayoutWrapper from "./LayoutWrapper";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import ServicesPage from "./pages/ServicesPage";
import DoctorsPage from "./pages/DoctorsPage";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import SpecialtyPage from "./pages/SpecialtyPage";
import NewsPage from "./pages/NewsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorProfile from "./pages/DoctorProfile";
import ServiceDetail from "./pages/ServiceDetail";

// Admin Pages + Layout
import AdminLayout from "./admin/AdminLayout";
import DashboardHome from "./admin/DashboardHome";
import ManageDoctors from "./admin/ManageDoctors";
import ManagePatients from "./admin/ManagePatients";
import ManageAppointments from "./admin/ManageAppointments";
import ManageServices from "./admin/ManageServices";
import ManageNews from "./admin/ManageNews";
import ManageFeedback from "./admin/ManageFeedback";

// Doctor Portal
import DoctorLayout from "./doctor/DoctorLayout";
import DoctorHome from "./doctor/DoctorHome";
import DoctorAppointments from "./doctor/DoctorAppointments";
import DoctorProfileManager from "./doctor/DoctorProfileManager";
import PatientRegistry from "./doctor/PatientRegistry";
import ClinicalRecords from "./doctor/ClinicalRecords";
import AvailabilityManager from "./doctor/AvailabilityManager";
import DoctorBilling from "./doctor/DoctorBilling";

// Patient Portal
import PatientLayout from "./patient/PatientLayout";
import PatientHome from "./patient/PatientHome";
import PatientPrescriptions from "./patient/PatientPrescriptions";
import PatientAppointments from "./patient/PatientAppointments";
import PatientReports from "./patient/PatientReports";
import PatientProfile from "./patient/PatientProfile";
import PatientBilling from "./patient/PatientBilling";

export default function App() {
  return (
    // Router **must wrap everything** to avoid "useRoutes only inside Router" error
    <Router>

      {/* LayoutWrapper controls header/footer visibility for login/register */}
      <LayoutWrapper>

        {/* App Routes */}
        <Routes>

          {/* ---------------- PUBLIC ROUTES ---------------- */}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />

          {/* Dynamic Specialty page */}
          <Route path="/specialty/:name" element={<SpecialtyPage />} />

          {/* Dynamic news article */}
          <Route path="/news/:id" element={<NewsPage />} />

          {/* Dynamic Service & Doctor Pages */}
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* ---------------- ADMIN ROUTES ---------------- */}

          {/* AdminLayout wraps all admin pages (sidebar + topbar) */}
          <Route path="/admin" element={<AdminLayout />}>

            {/* Inside /admin/... */}
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="news" element={<ManageNews />} />
            <Route path="feedback" element={<ManageFeedback />} />
          </Route>

          {/* ---------------- DOCTOR ROUTES ---------------- */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorHome />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile" element={<DoctorProfileManager />} />
            <Route path="patients" element={<PatientRegistry />} />
            <Route path="records" element={<ClinicalRecords />} />
            <Route path="availability" element={<AvailabilityManager />} />
            <Route path="billing" element={<DoctorBilling />} />
          </Route>

          {/* ---------------- PATIENT ROUTES ---------------- */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientHome />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="reports" element={<PatientReports />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="billing" element={<PatientBilling />} />
          </Route>

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
