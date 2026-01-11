import { useEffect, useState } from "react";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState(null);
    const [notes, setNotes] = useState({ diagnosis: "", notes: "", medications: "", instructions: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/doctor/appointments", {
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
        fetchAppointments();
    }, []);

    const openNotes = (apt) => {
        setSelectedApt(apt);
        setShowModal(true);
    };

    const handleSaveNotes = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:5000/api/doctor/records", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    appointment_id: selectedApt.id,
                    patient_email: selectedApt.patient_email,
                    ...notes
                })
            });
            if (res.ok) {
                setShowModal(false);
                setNotes({ diagnosis: "", notes: "", medications: "", instructions: "" });
                alert("Clinical record saved successfully!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Retrieving patient queue...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Appointment Schedule</h2>
                <p className="text-gray-500 font-bold mt-1">Manage your daily consultations and patient history.</p>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Patient Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Schedule</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Clinical Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black">
                                                {apt.patient_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1F2B6C]">{apt.patient_name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{apt.patient_email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-[#1F2B6C]">{apt.date}</p>
                                        <p className="text-xs text-blue-600 font-black uppercase tracking-widest">{apt.time}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openNotes(apt)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                                            >
                                                Add Notes
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1F2B6C]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8 animate-scaleUp">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-[#1F2B6C]">Clinical Notes</h3>
                                <p className="text-gray-400 font-bold text-sm">Patient: {selectedApt?.patient_name}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">✕</button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Diagnosis</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-[#1F2B6C]"
                                    value={notes.diagnosis}
                                    onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                                    placeholder="e.g. Chronic Hypertension"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Consultation Notes</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-[#1F2B6C]"
                                    rows="4"
                                    value={notes.notes}
                                    onChange={(e) => setNotes({ ...notes, notes: e.target.value })}
                                    placeholder="Patient reports occasional dizziness..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Medications (E-Prescription)</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-[#1F2B6C]"
                                        value={notes.medications}
                                        onChange={(e) => setNotes({ ...notes, medications: e.target.value })}
                                        placeholder="Amlodipine 5mg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Instructions</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-[#1F2B6C]"
                                        value={notes.instructions}
                                        onChange={(e) => setNotes({ ...notes, instructions: e.target.value })}
                                        placeholder="Once daily after breakfast"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSaveNotes}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                Save Records & Issue Prescription
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

