import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleSendFeedback = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // AUTH CHECK: Redirect to login if no active session
    if (!user || !token) {
      alert("Please login to share your feedback with us.");
      navigate("/login");
      return;
    }

    if (!feedback.trim()) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          email: user.email,
          message: feedback,
        }),
      });

      if (res.ok) {
        alert("Thank you! Your feedback has been received.");
        setFeedback("");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      alert("Failed to connect to server.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-gray-100">

      {/* ===================== PREMIUM INFO SECTION ===================== */}
      <div className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <InfoCard
            icon="/icons/phone.png"
            title="EMERGENCY"
            lines={["(237) 681-812-255", "(237) 666-331-894"]}
            color="bg-blue-50 text-blue-600"
          />

          <a href="https://maps.app.goo.gl/yUkTI9Xdwvc0797mn" target="_blank" rel="noopener noreferrer" className="block group">
            <InfoCard
              icon="/icons/location.png"
              title="LOCATION"
              lines={["0123 Medical Drive", "Modern City, Health State"]}
              color="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"
            />
          </a>

          <a href="mailto:support@hospital.com" className="block group">
            <InfoCard
              icon="/icons/email.png"
              title="EMAIL"
              lines={["prajwalgpatil2002@gmail.com", "support@hospital.com"]}
              color="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500"
            />
          </a>

          <InfoCard
            icon="/icons/clock.png"
            title="WORKING HOURS"
            lines={["Mon–Sat: 09:00 – 20:00", "Sun: Emergency Only"]}
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </div>

      {/* ===================== MAIN DARK FOOTER ===================== */}
      <div className="bg-[#1F2B6C] text-white pt-24 pb-12 overflow-hidden relative">
        {/* Decorative background circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="max-w-[1400px] mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Branding */}
            <div className="lg:col-span-4 max-w-sm">
              <h2 className="text-4xl font-black tracking-tighter mb-6">Meddical<span className="text-blue-400">.</span></h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 opacity-70">
                Setting the standard in healthcare with innovative technology and compassionate professionals.
              </p>
              <div className="flex gap-4">
                {["fb", "tw", "ig", "li"].map(social => (
                  <div key={social} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-blue-400 transition-all cursor-pointer flex items-center justify-center font-bold text-xs uppercase">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-8">Navigation</h4>
              <ul className="space-y-4">
                {["Appointment", "Doctors", "Services", "About Us"].map(link => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(" ", "")}`} className="text-blue-50/70 hover:text-white hover:translate-x-2 inline-block transition-all font-bold">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-8">Direct Contact</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-1">Call Center</p>
                  <p className="font-bold text-lg">(237) 681-812-255</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-1">Office Address</p>
                  <p className="font-bold text-blue-50 text-sm">0123 Medical Drive, Modern City</p>
                </div>
              </div>
            </div>

            {/* FEEDBACK INJECTOR */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/5">
              <h4 className="text-2xl font-black mb-4">Patient Feedback</h4>
              <p className="text-blue-200/70 text-sm mb-8 font-medium">Your insights help us provide better care for everyone.</p>

              <div className="relative group">
                <textarea
                  placeholder="How was your experience?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-white/10 border-none rounded-3xl px-6 py-6 text-white placeholder-blue-200/30 outline-none focus:ring-4 focus:ring-blue-400/20 transition-all resize-none h-32 text-sm font-medium"
                />
                <button
                  onClick={handleSendFeedback}
                  disabled={sending || !feedback.trim()}
                  className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-700 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 group"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <img src="/icons/send.svg" className="w-5 group-hover:rotate-12 transition-transform filter invert brightness-0" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-blue-300/40 mt-4 text-center font-bold uppercase tracking-widest">
                Authenticated submission via Meddical.Auth
              </p>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
              © 2026 Meddical Healthcare System – Excellence Guaranteed
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InfoCard({ icon, title, lines, color }) {
  return (
    <div className={`p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 h-full ${color.includes("group-hover") ? "" : color}`}>
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-inner ${color}`}>
        <img src={icon} className="w-8 h-8 object-contain" alt={title} />
      </div>
      <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">{title}</h4>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-sm font-bold opacity-80">{line}</p>
        ))}
      </div>
    </div>
  );
}
