import { useEffect, useState } from "react";

export default function AvailabilityManager() {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        // Fetch existing availability (mock or real)
        setLoading(false);
        setAvailability(days.map(d => ({ day: d, start: "09:00", end: "17:00", active: true })));
    }, []);

    const toggleDay = (day) => {
        setAvailability(availability.map(a => a.day === day ? { ...a, active: !a.active } : a));
    };

    const handleTimeChange = (day, field, value) => {
        setAvailability(availability.map(a => a.day === day ? { ...a, [field]: value } : a));
    };

    const saveChanges = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert("Availability schedule published!");
        }, 800);
    };

    if (loading) return <div className="p-10 text-[#1F2B6C] font-bold animate-pulse">Synchronizing Calendars...</div>;

    return (
        <div className="max-w-4xl space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Availability & Time Slots</h2>
                <p className="text-gray-500 font-bold mt-1">Configure your weekly working hours for online and offline consultations.</p>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
                {availability.map((item) => (
                    <div key={item.day} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-100 transition-all gap-6">
                        <div className="flex items-center gap-4 min-w-[150px]">
                            <input
                                type="checkbox"
                                checked={item.active}
                                onChange={() => toggleDay(item.day)}
                                className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className={`font-black text-lg ${item.active ? 'text-[#1F2B6C]' : 'text-gray-300'}`}>{item.day}</span>
                        </div>

                        {item.active ? (
                            <div className="flex items-center gap-4">
                                <input
                                    type="time"
                                    value={item.start}
                                    onChange={(e) => handleTimeChange(item.day, 'start', e.target.value)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-[#1F2B6C] focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <span className="text-gray-400 font-black">TO</span>
                                <input
                                    type="time"
                                    value={item.end}
                                    onChange={(e) => handleTimeChange(item.day, 'end', e.target.value)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-[#1F2B6C] focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        ) : (
                            <span className="text-red-400 font-black uppercase text-xs tracking-widest px-4 border-l-2 border-red-100">Unavailable / Off Day</span>
                        )}
                    </div>
                ))}

                <div className="pt-8">
                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="px-10 py-4 bg-[#1F2B6C] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Publishing..." : "Update Availability"}
                    </button>
                </div>
            </div>
        </div>
    );
}
