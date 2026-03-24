import { useEffect, useState } from "react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    specialization: "",
    experience: "",
    password: "", // New field for initial login
  });

  const [photo, setPhoto] = useState(null);

  // ------------------------------------
  // FETCH DOCTORS (SECURE)
  // ------------------------------------
  const loadDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/doctors", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Doctor fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // ------------------------------------
  // FORM HANDLING
  // ------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingDoctor(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      specialization: "",
      experience: "",
      password: "",
    });
    setPhoto(null);
    setShowForm(true);
  };

  const openEditForm = (doctor) => {
    setEditingDoctor(doctor);
    setForm(doctor);
    setShowForm(true);
  };

  // ------------------------------------
  // ADD / EDIT DOCTOR (SECURE)
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (photo) formData.append("photo", photo);

    const isEdit = !!editingDoctor;
    const url = isEdit
      ? `http://127.0.0.1:5001/api/admin/doctors/${editingDoctor.id}`
      : "http://127.0.0.1:5001/api/admin/doctors";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    if (res.ok) {
      setShowForm(false);
      setEditingDoctor(null);
      loadDoctors();
    } else {
      const data = await res.json();
      alert(data.message || "Error saving doctor");
    }
  };

  // ------------------------------------
  // DELETE DOCTOR (SECURE)
  // ------------------------------------
  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to remove this medical professional?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:5001/api/admin/doctors/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      loadDoctors();
    } else {
      alert("Failed to delete doctor.");
    }
  };

  if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Synchronizing Medical Staff...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">Medical Staff</h1>
          <p className="text-gray-500 font-medium mt-1">Manage all doctors and their specializations.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Add New Doctor
        </button>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {doctors.map((doc) => (
          <div key={doc.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img
                src={doc.photo ? `http://127.0.0.1:5001/uploads/doctors/${doc.photo}` : "/images/doctor-placeholder.jpg"}
                alt={doc.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEditForm(doc)} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white shadow-sm transition-all">
                  ✏️
                </button>
                <button onClick={() => deleteDoctor(doc.id)} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-700 hover:bg-red-600 hover:text-white shadow-sm transition-all">
                  🗑️
                </button>
              </div>
            </div>

            <div className="p-6 text-center flex-1">
              <h3 className="text-xl font-bold text-[#1F2B6C] mb-1">{doc.name}</h3>
              <p className="text-blue-600 font-extrabold text-[10px] uppercase tracking-widest">{doc.specialization || doc.department}</p>
              <div className="w-8 h-1 bg-blue-100 mx-auto rounded-full my-4" />
              <p className="text-gray-500 text-xs font-medium">{doc.experience} Experience</p>

              <button
                onClick={() => setViewDoctor(doc)}
                className="mt-6 w-full py-3 rounded-xl bg-gray-50 text-[#1F2B6C] font-bold text-sm hover:bg-[#1F2B6C] hover:text-white transition-all duration-300"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1F2B6C]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-[#1F2B6C] mb-8">
              {editingDoctor ? "Update Profile" : "New Professional"}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input name="name" placeholder="Dr. John Smith" value={form.name} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input name="email" placeholder="john@hospital.com" value={form.email} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                  <input name="phone" placeholder="+1 (234) 567" value={form.phone} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Department</label>
                  <input name="department" placeholder="Neurology" value={form.department} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                  <input name="specialization" placeholder="Brain Surgery" value={form.specialization} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                  <input name="experience" placeholder="10+ Years" value={form.experience} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]" />
                </div>
              </div>

              {!editingDoctor && (
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest ml-1">Initial Login Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Set a secure password for the doctor"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]"
                    required={!editingDoctor}
                  />
                  <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Note: The doctor will use this password for their first login.</p>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 text-center block">Update Professional Photo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-gray-100 rounded-[32px] cursor-pointer hover:bg-gray-50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{photo ? photo.name : "JPEG, PNG, WEBP Only"}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-5 bg-gray-100 text-gray-500 rounded-3xl font-extrabold hover:bg-gray-200 transition-all">
                  Discard
                </button>
                <button className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-3xl font-extrabold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
                  {editingDoctor ? "Commit Changes" : "Register Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewDoctor && (
        <div className="fixed inset-0 bg-[#1F2B6C]/60 backdrop-blur-sm z-[100] flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-lg h-full p-12 overflow-y-auto shadow-2xl animate-slideInRight">
            <button onClick={() => setViewDoctor(null)} className="mb-10 w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all">
              ✕
            </button>

            <div className="text-center">
              <div className="w-56 h-72 mx-auto rounded-[40px] overflow-hidden shadow-2xl mb-8 -rotate-2">
                <img
                  src={`http://127.0.0.1:5001/uploads/doctors/${viewDoctor.photo}`}
                  className="w-full h-full object-cover"
                  alt={viewDoctor.name}
                />
              </div>

              <h2 className="text-4xl font-black text-[#1F2B6C]">{viewDoctor.name}</h2>
              <div className="inline-block px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-extrabold text-xs uppercase tracking-[0.2em] mt-2 mb-8">
                {viewDoctor.department} Specialist
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-6 bg-gray-50 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-xl font-black text-[#1F2B6C] tracking-tighter">{viewDoctor.experience}</p>
                </div>
                <div className="p-6 bg-blue-600 rounded-3xl text-white">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-black tracking-tighter">Available</p>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="p-6 border border-gray-100 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Communication</p>
                  <p className="font-bold text-[#1F2B6C]">{viewDoctor.email}</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Office</p>
                  <p className="font-bold text-[#1F2B6C]">{viewDoctor.phone || "Not Set"}</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Medical Focus</p>
                  <p className="font-bold text-[#1F2B6C]">{viewDoctor.specialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
