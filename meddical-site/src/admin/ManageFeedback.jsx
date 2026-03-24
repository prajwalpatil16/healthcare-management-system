import { useEffect, useState } from "react";

export default function ManageFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5001/api/admin/feedback", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setFeedback(data);
      } catch (err) {
        console.error("Feedback fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Analyzing Patient Feedback...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">User Feedback</h1>
          <p className="text-gray-500 font-medium mt-1">Review sentiments and suggestions from your patients.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold border border-emerald-100">
          {feedback.length} Entries Received
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedback.map((f) => (
          <div key={f.id} className="group bg-white rounded-[40px] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                {f.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-extrabold text-[#1F2B6C]">{f.name || "Anonymous User"}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(f.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-3xl p-6 flex-1 mb-6 italic text-gray-600 text-sm leading-relaxed relative">
              <span className="absolute -top-2 -left-2 text-4xl text-blue-100 opacity-50">"</span>
              {f.message}
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">{f.email || "No Email Provided"}</p>
              <div className="flex gap-1 text-xs">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback.length === 0 && (
        <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm">
          <div className="text-6xl mb-6 grayscale opacity-20">💬</div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Waiting for user submissions...</p>
        </div>
      )}
    </div>
  );
}
