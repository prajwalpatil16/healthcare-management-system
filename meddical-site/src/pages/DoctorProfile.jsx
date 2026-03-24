import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DoctorProfile() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch doctor bio and details
        fetch("http://127.0.0.1:5001/api/doctors")
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((d) =>
                    d.id === parseInt(id) ||
                    d.name.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase()
                );
                setDoctor(found);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="py-40 text-center text-[#1F2B6C] font-bold animate-pulse">Consulting Patient Records...</div>;
    if (!doctor) return <div className="py-40 text-center text-red-500 font-bold">Specialist not found in our directory.</div>;

    return (
        <div className="bg-[#F8FAFC] pb-24">
            {/* HEADER HERO */}
            <div className="relative h-[450px] w-full bg-[#1F2B6C] overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

                <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12 relative z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-end">
                        <div className="w-64 h-80 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl shrink-0 group">
                            <img
                                src={doctor.photo ? `http://127.0.0.1:5001/uploads/doctors/${doctor.photo}` : "/images/doctor-placeholder.jpg"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={doctor.name}
                            />
                        </div>
                        <div className="pb-4">
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                                {doctor.specialization || doctor.department} Expert
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-[#1F2B6C] mb-2">{doctor.name}</h1>
                            <p className="text-gray-500 font-bold text-lg">{doctor.department} Department • {doctor.experience} Experience</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">

                {/* LEFT COLUMN - STATS & INFO */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-[#1F2B6C] mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-600 rounded-full" />
                            Biography
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium text-lg">
                            {doctor.name} is a renowned specialist in {doctor.specialization || doctor.department}, dedicated to providing patient-centered care. With over {doctor.experience} of practice, they have pioneered several clinical protocols and lead the {doctor.department} department at Meddical.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                            <StatBox label="Patients" value="5K+" />
                            <StatBox label="Surgeries" value="1.2K+" />
                            <StatBox label="Rank" value="#1" />
                            <StatBox label="Availability" value="100%" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-[#1F2B6C] mb-6">Expertise</h3>
                            <ul className="space-y-4">
                                {["Advanced Diagnostics", "Clinical Research", "Precision Medicine", "Patient Counseling"].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-[#1F2B6C] mb-6">Education</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-black text-[#1F2B6C]">PhD in Clinical Medicine</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical University of Science</p>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[#1F2B6C]">Board Certified Specialist</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">National Health Institute</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - BOOKING & CONTACT */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#1F2B6C] p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/5 rounded-full" />
                        <h3 className="text-2xl font-black mb-6">Book Consultation</h3>
                        <p className="text-blue-100/70 mb-8 font-medium">Schedule a private session with {doctor.name} for expert medical advice.</p>

                        <Link to="/appointment" className="block w-full text-center py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/50 uppercase tracking-widest text-xs">
                            Get Started →
                        </Link>

                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <ContactRow icon="📞" label="Direct Call" value={doctor.phone || "Office Mainline"} />
                            <ContactRow icon="✉️" label="Inquiry Email" value={doctor.email || "support@meddical.com"} />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-[#1F2B6C] mb-6">Schedule</h3>
                        <div className="space-y-3">
                            <DayRow day="Monday" time="09:00 - 17:00" />
                            <DayRow day="Wednesday" time="09:00 - 17:00" />
                            <DayRow day="Friday" time="09:00 - 15:00" />
                            <DayRow day="Saturday" time="Closed" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="p-4 bg-blue-50/50 rounded-3xl border border-blue-100 text-center">
            <p className="text-2xl font-black text-blue-600 mb-1">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    )
}

function ContactRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{icon}</div>
            <div>
                <p className="text-[9px] font-black uppercase text-blue-300 opacity-50 tracking-widest">{label}</p>
                <p className="font-bold text-xs truncate max-w-[150px]">{value}</p>
            </div>
        </div>
    )
}

function DayRow({ day, time }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-500">{day}</span>
            <span className={`font-black uppercase tracking-tighter ${time === 'Closed' ? 'text-red-400' : 'text-[#1F2B6C]'}`}>{time}</span>
        </div>
    )
}
