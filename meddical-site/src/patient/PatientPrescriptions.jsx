import { useEffect, useState } from "react";

export default function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/patient/prescriptions", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setPrescriptions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Syncing pharmacy records...</div>;

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Digital Prescriptions</h2>
                <p className="text-gray-500 font-bold mt-1">Access and download your medical prescriptions issued by our doctors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {prescriptions.map((px) => (
                    <div key={px.id} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">💊</div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Date Issued</p>
                                <p className="font-extrabold text-[#1F2B6C]">{new Date(px.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-black text-[#1F2B6C] mb-2">{px.medicine_name}</h3>
                            <div className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                {px.dosage}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Instructions</p>
                            <p className="text-gray-600 font-bold text-sm italic">"{px.instructions}"</p>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Prescribing Physician</p>
                                <p className="font-bold text-[#1F2B6C]">{px.doctor_name}</p>
                            </div>
                            <button className="px-6 py-3 bg-[#1F2B6C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:scale-105 transition-all">
                                Download PDF
                            </button>
                        </div>
                    </div>
                ))}
                {prescriptions.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic">No prescriptions found. Please visit a specialist for a consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
