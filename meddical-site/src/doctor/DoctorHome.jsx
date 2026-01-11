import { useEffect, useState } from "react";

export default function DoctorHome() {
    const [stats, setStats] = useState({
        today_appointments: 0,
        total_patients: 0,
        pending_reports: 0,
        notifications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/doctor/dashboard-stats", {
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

    if (loading) return <div className="text-[#1F2B6C] font-bold animate-pulse text-xl">Loading clinical metrics...</div>;

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-[#1F2B6C]">Welcome Back, Doctor</h1>
                <p className="text-gray-500 font-bold mt-2 italic">“The art of healing comes from nature, not from the physician.”</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard title="Today's Vitals" value={stats.today_appointments} sub="Confirmed visits" icon="📅" color="bg-blue-600" />
                <MetricCard title="Total Patients" value={stats.total_patients} sub="Under your care" icon="👥" color="bg-indigo-600" />
                <MetricCard title="Pending Reports" value={stats.pending_reports} sub="Requires attention" icon="📁" color="bg-amber-500" />
                <MetricCard title="Clinical Alerts" value={stats.notifications} sub="Urgent notices" icon="🔔" color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Schedule Placeholder */}
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-[#1F2B6C] mb-8">System Performance</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic text-sm">Patient trend analytics coming soon...</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#1F2B6C] p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-2xl font-black mb-8">Clinical Quick Links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ActionButton label="Issue Prescription" icon="✒️" />
                        <ActionButton label="Book Follow-up" icon="📅" />
                        <ActionButton label="Order Lab Test" icon="🧪" />
                        <ActionButton label="Patient Search" icon="🔍" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, sub, icon, color }) {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${color}`} />
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-4xl font-black text-[#1F2B6C] tracking-tighter">{value}</span>
            </div>
            <div>
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">{title}</h4>
                <p className="text-gray-500 font-bold text-xs">{sub}</p>
            </div>
        </div>
    );
}

function ActionButton({ label, icon }) {
    return (
        <button className="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-left group">
            <span className="text-xl group-hover:scale-120 transition-transform">{icon}</span>
            <span className="font-bold text-sm">{label}</span>
        </button>
    );
}
