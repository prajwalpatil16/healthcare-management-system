import { useEffect, useState } from "react";

export default function PatientProfile() {
    const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/patient/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:5000/api/patient/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            });
            if (res.ok) alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-blue-900 font-bold animate-pulse">Loading profile settings...</div>;

    return (
        <div className="max-w-4xl space-y-10 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Account Registry</h2>
                <p className="text-gray-500 font-bold mt-1">Update your personal information and contact preferences.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Legal Full Name</label>
                        <input
                            type="text"
                            className="w-full px-8 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-[#1F2B6C] focus:ring-4 focus:ring-blue-100 transition-all"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Email Address (Primary)</label>
                        <input
                            type="email"
                            className="w-full px-8 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-400 cursor-not-allowed"
                            value={profile.email}
                            disabled
                        />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Contact Number</label>
                        <input
                            type="text"
                            className="w-full px-8 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-[#1F2B6C] focus:ring-4 focus:ring-blue-100 transition-all"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-12 py-5 bg-[#1F2B6C] text-white rounded-[24px] font-black shadow-2xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Synchronize Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
