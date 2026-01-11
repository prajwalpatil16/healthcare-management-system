import { useEffect, useState } from "react";

export default function PatientRegistry() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/doctor/patients", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setPatients(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-[#1F2B6C] font-bold animate-pulse">Consulting Patient Archives...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#1F2B6C]">Patient Registry</h2>
                    <p className="text-gray-500 font-bold mt-1">Access medical history and contact details of all your patients.</p>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-[#1F2B6C] shadow-sm w-full md:w-80"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((p, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 font-black text-2xl">
                                    {p.patient_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#1F2B6C] mb-1">{p.patient_name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{p.email}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500">📞 {p.phone || "N/A"}</span>
                                    <button className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline">View History →</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">
                        No patient records match your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
