import { useEffect, useState } from "react";

export default function PatientReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/patient/reports", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setReports(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div className="p-10 text-blue-900 font-bold animate-pulse">Accessing medical archive...</div>;

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Medical Reports</h2>
                <p className="text-gray-500 font-bold mt-1">Securely view and download your diagnostic lab results.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-[-20px] right-[-20px] text-8xl opacity-[0.03] group-hover:scale-110 transition-transform">📄</div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600">📜</div>
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{report.status}</span>
                        </div>
                        <h3 className="text-xl font-black text-[#1F2B6C] mb-2">{report.title}</h3>
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">{report.category} • {report.date}</p>

                        <button className="w-full py-4 bg-gray-50 text-[#1F2B6C] font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            View Digital Report
                        </button>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px]">
                        <p className="text-gray-400 font-bold italic">No diagnostic reports available at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
