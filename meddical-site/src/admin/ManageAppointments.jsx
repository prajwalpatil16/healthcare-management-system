import { useEffect, useState } from "react";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  // ----------------------------------
  // LOAD DATA (SECURE)
  // ----------------------------------
  useEffect(() => {
    loadAppointments();
  }, [page, status]);

  const loadAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:5001/api/admin/appointments?page=${page}&limit=${limit}&status=${status}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const result = await res.json();

      setAppointments(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error("Failed to load appointments", err);
      setAppointments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // ACTIONS (SECURE)
  // ----------------------------------
  const approveAppointment = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:5001/api/admin/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: "APPROVED" }),
    });

    if (res.ok) {
      loadAppointments();
    } else {
      alert("Failed to approve appointment.");
    }
  };

  const bulkApprove = async () => {
    if (!confirm("Are you sure you want to approve ALL pending appointments? This action is irreversible.")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://127.0.0.1:5001/api/admin/appointments/approve-all",
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      loadAppointments();
    } else {
      alert("Bulk approval failed.");
    }
  };

  const deleteAppointment = async (id) => {
    if (!confirm("Delete this appointment record?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:5001/api/admin/appointments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      loadAppointments();
    }
  }

  // ----------------------------------
  // PAGINATION
  // ----------------------------------
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading && page === 1) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Retrieving Appointment Logs...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">Appointments</h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage patient booking requests.</p>
        </div>

        <button
          onClick={bulkApprove}
          disabled={status !== "PENDING" || total === 0}
          className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${status === "PENDING" && total > 0
              ? "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
        >
          {status === "PENDING" ? "✓ Approve All Pending" : "Bulk Action Unavailable"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 p-2 bg-gray-100 rounded-[24px] w-fit">
        {["PENDING", "APPROVED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`px-8 py-3 rounded-2xl font-bold text-sm tracking-widest transition-all ${status === s
                ? "bg-white text-[#1F2B6C] shadow-lg shadow-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-32 text-center">
            <div className="text-6xl mb-6 grayscale opacity-20">📅</div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No {status.toLowerCase()} appointments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    <th className="p-8">Patient Name</th>
                    <th className="p-8">Medical Dept</th>
                    <th className="p-8">Preferred Slot</th>
                    <th className="p-8 text-center">Status</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {appointments.map((a) => (
                    <tr key={a.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="p-8 font-extrabold text-[#1F2B6C] group-hover:text-blue-600 transition-all">{a.patient_name}</td>
                      <td className="p-8">
                        <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                          {a.department}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#1F2B6C]/80">{new Date(a.date).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.time}</p>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full uppercase tracking-widest ${a.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-3">
                          {a.status === "PENDING" && (
                            <button
                              onClick={() => approveAppointment(a.id)}
                              className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"
                              title="Approve Appointment"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(a.id)}
                            className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm border border-red-100"
                            title="Delete Record"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Showing Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-6 py-2 bg-white border border-gray-100 text-[#1F2B6C] font-bold text-sm rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${page === i + 1 ? "bg-[#1F2B6C] text-white shadow-lg shadow-blue-900/10" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2 bg-white border border-gray-100 text-[#1F2B6C] font-bold text-sm rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
