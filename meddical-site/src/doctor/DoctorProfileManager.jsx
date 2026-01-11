import { useEffect, useState } from "react";

export default function DoctorProfileManager() {
    const [profile, setProfile] = useState({
        phone: "",
        specialization: "",
        experience: "",
        photo: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:5000/api/doctor/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfile({ ...profile, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const formData = new FormData();
        formData.append("phone", profile.phone);
        formData.append("specialization", profile.specialization);
        formData.append("experience", profile.experience);
        if (profile.photo instanceof File) {
            formData.append("photo", profile.photo);
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:5000/api/doctor/profile", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            setMessage(data.message);
        } catch (err) {
            setMessage("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-[#1F2B6C] font-bold animate-pulse">Loading Profile...</div>;

    return (
        <div className="max-w-4xl space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Profile Management</h2>
                <p className="text-gray-500 font-bold mt-1">Update your professional details and contact information.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
                {message && (
                    <div className={`p-4 rounded-2xl text-sm font-bold ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone || ""}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-[#1F2B6C]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Experience</label>
                        <input
                            type="text"
                            name="experience"
                            value={profile.experience || ""}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-[#1F2B6C]"
                            placeholder="e.g. 10 Years"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Specialization</label>
                    <textarea
                        name="specialization"
                        value={profile.specialization || ""}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-[#1F2B6C]"
                        placeholder="Describe your areas of expertise..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Profile Photo</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                            {profile.photo && !(profile.photo instanceof File) ? (
                                <img src={`http://127.0.0.1:5000/uploads/doctors/${profile.photo}`} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                            )}
                        </div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="text-xs font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-4 bg-[#1F2B6C] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving Changes..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
