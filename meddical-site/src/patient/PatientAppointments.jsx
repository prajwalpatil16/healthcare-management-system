import { useEffect, useState } from "react";

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApts = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/patient/appointments", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setAppointments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApts();
    }, []);

    if (loading) return <div className="p-10 text-blue-900 font-bold animate-pulse">Fetching your schedule...</div>;

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">My Appointments</h2>
                <p className="text-gray-500 font-bold mt-1">Keep track of your past and upcoming consultations.</p>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Doctor / Specialist</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date & Time</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-[#1F2B6C]">{apt.doctor_name || "Unassigned"}</p>
                                        <p className="text-xs text-gray-400 font-medium">{apt.department}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-[#1F2B6C]">{apt.date}</p>
                                        <p className="text-xs text-blue-600 font-black uppercase">{apt.time}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                            apt.status === 'APPROVED' ? 'bg-blue-100 text-blue-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-gray-500 font-medium truncate max-w-xs">{apt.message || "Regular consultation"}</p>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-300 font-bold italic text-lg">
                                        No appointments scheduled yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
