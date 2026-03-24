import { useEffect, useState } from "react";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewPatient, setViewPatient] = useState(null);

  // ----------------------------------
  // FETCH PATIENTS (SECURE)
  // ----------------------------------
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5001/api/admin/patients", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Patient fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // ----------------------------------
  // FILTER
  // ----------------------------------
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Synchronizing Patient Records...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">
            Patient Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Total of {patients.length} registered patients in the system.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium w-64 text-gray-700"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                <th className="p-8">Patient Info</th>
                <th className="p-8">Contact Details</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8">Registration Date</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#1F2B6C] font-bold text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#1F2B6C] group-hover:text-blue-600 transition-colors">{p.name}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">ID: PAT-{p.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-600">{p.email}</p>
                      <p className="text-xs text-gray-400 font-medium">{p.phone}</p>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full uppercase tracking-widest ${p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                      {p.status || "Active"}
                    </span>
                  </td>
                  <td className="p-8">
                    <p className="text-sm font-bold text-[#1F2B6C]/80">{new Date(p.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewPatient(p)}
                        className="p-3 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-gray-100"
                      >
                        👁️‍🗨️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="p-20 text-center">
            <div className="text-6xl mb-4 grayscale opacity-20">📂</div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              No matching patient records found
            </p>
          </div>
        )}
      </div>

      {/* VIEW PATIENT MODAL */}
      {viewPatient && (
        <div className="fixed inset-0 bg-[#1F2B6C]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <button
              onClick={() => setViewPatient(null)}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all font-bold"
            >
              ✕
            </button>

            <div className="px-10 pb-12">
              <div className="relative -mt-16 mb-8 inline-block">
                <div className="w-32 h-32 bg-white rounded-[40px] p-2 shadow-xl">
                  <div className="w-full h-full bg-blue-50 rounded-[32px] flex items-center justify-center text-4xl text-blue-600 font-black">
                    {viewPatient.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>

              <h2 className="text-3xl font-black text-[#1F2B6C] mb-1">
                {viewPatient.name}
              </h2>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-8">Patient Profile</p>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <p className="text-sm font-bold text-[#1F2B6C]">{viewPatient.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <p className="text-sm font-bold text-[#1F2B6C]">{viewPatient.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Registered At</label>
                  <p className="text-sm font-bold text-[#1F2B6C]">{new Date(viewPatient.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Profile Status</label>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">Verified Account</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-[#1F2B6C] text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/10">
                  View Medical Records
                </button>
                <button className="flex-1 border-2 border-gray-100 text-[#1F2B6C] font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
