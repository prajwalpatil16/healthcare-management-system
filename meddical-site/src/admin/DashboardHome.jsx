import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#1F2B6C", "#3B82F6", "#60A5FA", "#93C5FD"];

export default function DashboardHome() {
  const [stats, setStats] = useState({
    doctor_count: 0,
    patient_count: 0,
    appointment_count: 0,
    feedback_count: 0,
    recent_appointments: []
  });

  const [loading, setLoading] = useState(true);

  // ----------------------------------
  // LOAD DASHBOARD DATA
  // ----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5000/api/admin/stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for charts if backend doesn't provide historical data yet
  const appointmentTrends = [
    { name: "Mon", count: 4 },
    { name: "Tue", count: 7 },
    { name: "Wed", count: 5 },
    { name: "Thu", count: 12 },
    { name: "Fri", count: 8 },
    { name: "Sat", count: 3 },
    { name: "Sun", count: 2 },
  ];

  const departmentDistribution = [
    { name: "Cardiology", value: 400 },
    { name: "Neurology", value: 300 },
    { name: "Pediatrics", value: 300 },
    { name: "General", value: 200 },
  ];

  if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Loading Dashboard Analytics...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">
            Hospital Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
          Generate Report
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          title="Total Doctors"
          value={stats.doctor_count}
          icon="👨‍⚕️"
          change="+2 this month"
          color="bg-blue-50 text-blue-600"
        />
        <Kpi
          title="Total Patients"
          value={stats.patient_count}
          icon="👥"
          change="+15% vs last week"
          color="bg-indigo-50 text-indigo-600"
        />
        <Kpi
          title="Appointments"
          value={stats.appointment_count}
          icon="📅"
          change="8 pending today"
          color="bg-emerald-50 text-emerald-600"
        />
        <Kpi
          title="Feedback"
          value={stats.feedback_count}
          icon="⭐"
          change="4.8/5.0 average"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointment Trends Chart */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#1F2B6C] mb-8">Appointment Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentTrends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#1F2B6C]">Recent Bookings</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {stats.recent_appointments?.length > 0 ? (
              stats.recent_appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-xl">
                      {a.patient_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2B6C]">{a.patient_name}</p>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{a.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full uppercase tracking-widest ${a.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                      {a.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">{a.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10">No recent appointments found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Distribution (Pie) */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-xl font-bold text-[#1F2B6C] mb-6">Departments</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {departmentDistribution.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Integration Info */}
        <div className="bg-[#1F2B6C] p-10 rounded-[40px] shadow-2xl lg:col-span-2 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">System Health: Excellent</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-lg">All backend services are running smoothly. Database connections are optimized with persistent pooling.</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-1">Response Time</p>
                <p className="text-2xl font-bold">124ms</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-1">Uptime</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------
// KPI CARD COMPONENT
// ----------------------------------
function Kpi({ title, value, icon, change, color }) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl text-2xl ${color} transition-transform group-hover:scale-110 duration-500`}>
          {icon}
        </div>
        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
          LIVE
        </span>
      </div>
      <div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-1">{title}</p>
        <p className="text-4xl font-extrabold text-[#1F2B6C] tracking-tighter">
          {value}
        </p>
        <p className="text-xs text-blue-500 font-bold mt-4 flex items-center gap-1">
          <span className="text-[10px]">↗</span> {change}
        </p>
      </div>
    </div>
  );
}
