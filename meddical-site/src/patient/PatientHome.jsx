import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PatientHome() {
    const [stats, setStats] = useState({
        upcoming_appointments: 0,
        prescriptions_count: 0,
        medical_reports: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5001/api/patient/dashboard-stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-[#1F2B6C] font-bold animate-pulse text-xl">Loading health summary...</div>;

    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#1F2B6C]">Health Summary</h1>
                    <p className="text-gray-500 font-bold mt-2">Manage your appointments, prescriptions, and records in one place.</p>
                </div>
                <Link to="/appointment" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                    + Book New Consultation
                </Link>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PatientStatBox label="Upcoming Visits" value={stats.upcoming_appointments} icon="📅" gradient="from-blue-500 to-blue-700" />
                <PatientStatBox label="Active Prescriptions" value={stats.prescriptions_count} icon="💊" gradient="from-indigo-500 to-indigo-700" />
                <PatientStatBox label="Digital Reports" value={stats.medical_reports} icon="📄" gradient="from-[#1F2B6C] to-[#3446A3]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Health Tip Card */}
                <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] text-[150px] opacity-5 group-hover:scale-110 transition-transform duration-700 rotate-12">❤️</div>
                    <h3 className="text-2xl font-black text-[#1F2B6C] mb-6">Daily Health Tip</h3>
                    <p className="text-gray-600 font-bold text-lg leading-relaxed relative z-10">
                        Drinking enough water is vital for your health. Aim for 8 glasses a day to keep your systems running smoothly and your skin glowing.
                    </p>
                    <div className="mt-8 pt-8 border-t border-gray-50">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Medical Insights • 5 Min Read</span>
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-gray-50 p-10 rounded-[50px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl mb-4">🔔</div>
                    <h4 className="text-lg font-black text-[#1F2B6C] mb-2">Recent Notifications</h4>
                    <p className="text-gray-400 font-bold text-sm italic">You have no new alerts. Stay healthy!</p>
                </div>
            </div>
        </div>
    );
}

function PatientStatBox({ label, value, icon, gradient }) {
    return (
        <div className={`p-10 rounded-[50px] bg-gradient-to-br ${gradient} text-white shadow-xl hover:-translate-y-2 transition-all duration-500`}>
            <div className="text-5xl mb-6">{icon}</div>
            <p className="text-4xl font-black tracking-tighter mb-2">{value}</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60">{label}</p>
        </div>
    )
}
