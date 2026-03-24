import { useEffect, useState } from "react";

export default function ClinicalRecords() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState(null);
    const [record, setRecord] = useState(null);

    useEffect(() => {
        const fetchApts = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5001/api/doctor/appointments", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setAppointments(data.filter(a => a.status === 'approved' || a.status === 'APPROVED'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApts();
    }, []);

    const viewRecord = async (aptId) => {
        const token = localStorage.getItem("token");
        setSelectedApt(aptId);
        setRecord(null);
        try {
            const res = await fetch(`http://127.0.0.1:5001/api/doctor/records/${aptId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setRecord(data.id ? data : { message: "No notes recorded for this consultation." });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-[#1F2B6C] font-bold animate-pulse">Retrieving Clinical History...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Medical Records</h2>
                <p className="text-gray-500 font-bold mt-1">Review historical diagnoses and prescriptions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest px-4">Completed Consultations</h3>
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {appointments.length > 0 ? appointments.map(apt => (
                            <button
                                key={apt.id}
                                onClick={() => viewRecord(apt.id)}
                                className={`w-full p-6 text-left hover:bg-blue-50/50 transition-all flex items-center justify-between group ${selectedApt === apt.id ? 'bg-blue-50/80' : ''}`}
                            >
                                <div>
                                    <p className="font-bold text-[#1F2B6C]">{apt.patient_name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{apt.date}</p>
                                </div>
                                <span className="text-blue-300 group-hover:translate-x-1 transition-transform">➔</span>
                            </button>
                        )) : (
                            <div className="p-10 text-center text-gray-400 font-bold italic">No records to display.</div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7">
                    {selectedApt ? (
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8 min-h-[400px]">
                            {record ? (
                                record.id ? (
                                    <>
                                        <div>
                                            <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-4">Diagnosis & Notes</h3>
                                            <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Primary Diagnosis</p>
                                                    <p className="text-[#1F2B6C] font-bold">{record.diagnosis}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Clinical Notes</p>
                                                    <p className="text-gray-600 font-medium leading-relaxed">{record.notes}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {record.medications && (
                                            <div>
                                                <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-4">Prescription</h3>
                                                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                                    <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Medications</p>
                                                    <p className="text-[#1F2B6C] font-black mb-4">{record.medications}</p>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Instructions</p>
                                                    <p className="text-gray-500 font-bold italic text-sm">{record.instructions}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                                        <span className="text-5xl mb-4">📝</span>
                                        <p className="font-bold italic">{record.message}</p>
                                    </div>
                                )
                            ) : (
                                <div className="animate-pulse flex space-y-4 flex-col">
                                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                    <div className="h-32 bg-gray-100 rounded"></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 border-4 border-dashed border-gray-50 rounded-[40px]">
                            <span className="text-6xl mb-4">📂</span>
                            <p className="text-xl font-black">Select a consultation to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
