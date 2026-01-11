import { useParams, Link } from "react-router-dom";
import { specialtiesData } from "../data/specialtiesData";

const fallbackServices = {
    "free-checkup": {
        title: "Free Health Checkup",
        description: "Our preventive health screening program is designed to detect potential health issues before they become serious. We provide comprehensive vitals check, blood work, and general consultation at zero cost for registered patients.",
        achievements: ["Early detection of chronic conditions", "Personalized health roadmap", "Free baseline metabolic screening"]
    },
    "pediatrics": {
        title: "Pediatrics & Child Care",
        description: "Comprehensive medical care for infants, children, and adolescents. Our pediatrics department focus on physical, emotional, and social health through every developmental stage.",
        achievements: ["Child-friendly treatment environments", "Advanced immunization programs", "Specialized pediatric emergency care"]
    },
    "blood-bank": {
        title: "24/7 Blood Bank",
        description: "A state-of-the-art blood collection and storage facility ensuring safe and ready supply of all blood types for emergencies and scheduled surgeries.",
        achievements: ["Zero-contamination storage technology", "Rapid cross-matching capability", "100% voluntary donor screening"]
    },
    "diagnostics": {
        title: "Diagnostics & Imaging",
        description: "High-precision diagnostic services featuring the latest MRI, CT, and Ultrasound technology for accurate clinical assessments and faster recovery planning.",
        achievements: ["AI-enhanced imaging precision", "Same-day digital report delivery", "Ultra-low radiation scanning technology"]
    }
};

export default function ServiceDetail() {
    const { id } = useParams();
    const service = specialtiesData[id] || fallbackServices[id];

    if (!service) {
        return (
            <div className="py-40 text-center bg-[#F8FAFC]">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-6">🏥</div>
                    <h2 className="text-3xl font-black text-[#1F2B6C] mb-4">Service Not Located</h2>
                    <p className="text-gray-500 font-medium mb-8">The requested medical documentation is currently being updated by our clinical team.</p>
                    <Link to="/services" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold">
                        Return to Directory <span>→</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">

            {/* ===================== HERO SECTION ===================== */}
            <div className="relative w-full py-24 bg-[#1F2B6C] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-[-12deg] translate-x-1/4" />
                <div className="max-w-[1400px] mx-auto px-10 relative z-10 text-center">
                    <span className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        Clinical Specialization
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                        {service.title}
                    </h1>
                    <p className="text-blue-100/70 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                        World-class medical solutions and patient-focused care in {service.title.toLowerCase()}.
                    </p>
                </div>
            </div>

            {/* ===================== VERTICAL CONTENT FLOW ===================== */}
            <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

                {/* 1. OVERVIEW SECTION */}
                <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-[#1F2B6C] mb-6 border-l-4 border-blue-600 pl-6">Clinical Overview</h2>
                            <p className="text-gray-600 text-lg md:text-xl font-medium leading-loose">
                                {service.description}
                            </p>
                        </div>
                        <div className="w-full md:w-80 bg-blue-50 p-8 rounded-3xl border border-blue-100 shrink-0">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Quick Facts</h4>
                            <div className="space-y-4">
                                <FactRow label="Availability" value="24/7 Support" />
                                <FactRow label="Efficiency" value="99.8% Success" />
                                <FactRow label="Staff" value="Senior Experts" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ACHIEVEMENTS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {service.achievements?.map((ach, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs mb-6">
                                0{i + 1}
                            </div>
                            <p className="text-[#1F2B6C] font-bold text-lg leading-relaxed">{ach}</p>
                        </div>
                    ))}
                </div>

                {/* 3. CALL TO ACTION & CONTACT (Side by Side but Clear) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Card */}
                    <div className="bg-[#1F2B6C] rounded-[40px] p-12 text-white shadow-2xl shadow-blue-900/40">
                        <h3 className="text-2xl font-black mb-10">Emergency Department</h3>
                        <div className="space-y-8">
                            <ContactItem icon="📞" label="Direct Line" value="(237) 681-812-255" />
                            <ContactItem icon="✉️" label="Inquiry Email" value="support@meddical.com" />
                            <ContactItem icon="🕒" label="Operating Hours" value="Always Open" />
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="bg-blue-600 rounded-[40px] p-12 text-white shadow-2xl flex flex-col justify-center items-center text-center">
                        <div className="text-5xl mb-6">📅</div>
                        <h3 className="text-3xl font-black mb-6 leading-tight">Book Your Consultation Today</h3>
                        <p className="text-blue-100 font-medium mb-10 opacity-80">
                            Skip the queue and schedule your appointment online for faster medical evaluation.
                        </p>
                        <Link to="/appointment" className="px-10 py-5 bg-white text-blue-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                            Start Reservation →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

function FactRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-[#1F2B6C]/40">{label}</span>
            <span className="font-black text-[#1F2B6C]">{value}</span>
        </div>
    )
}

function ContactItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase text-blue-300 opacity-50 tracking-widest">{label}</p>
                <p className="text-lg font-black">{value}</p>
            </div>
        </div>
    )
}
