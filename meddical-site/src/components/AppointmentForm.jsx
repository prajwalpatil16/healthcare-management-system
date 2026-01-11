import { useState } from "react";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    patient_name: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    date: "",
    time: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("http://127.0.0.1:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Appointment booked successfully! Our team will contact you soon." });
        setForm({
          patient_name: "",
          email: "",
          phone: "",
          gender: "",
          department: "",
          date: "",
          time: "",
          message: "",
        });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to book appointment." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1F2B6C] text-white p-8 md:p-12 rounded-3xl shadow-2xl w-full">
      <h3 className="text-3xl font-bold mb-8 text-center md:text-left">
        Book an Appointment
      </h3>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl text-center font-medium ${status.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
          }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GRID INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Patient Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Full Name</label>
            <input
              type="text"
              name="patient_name"
              placeholder="John Doe"
              value={form.patient_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition"
              required
            >
              <option value="" className="text-black">Select Gender</option>
              <option value="male" className="text-black">Male</option>
              <option value="female" className="text-black">Female</option>
              <option value="other" className="text-black">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+1 (234) 567-890"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Preferred Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Preferred Time</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition"
              required
            >
              <option value="" className="text-black">Select Time Slot</option>
              <option value="10:00 AM" className="text-black">10:00 AM</option>
              <option value="11:00 AM" className="text-black">11:00 AM</option>
              <option value="01:00 PM" className="text-black">01:00 PM</option>
              <option value="03:00 PM" className="text-black">03:00 PM</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition"
              required
            >
              <option value="" className="text-black">Select Department</option>
              <option value="Neurology" className="text-black">Neurology</option>
              <option value="Cardiology" className="text-black">Cardiology</option>
              <option value="Orthopedics" className="text-black">Orthopedics</option>
              <option value="Dermatology" className="text-black">Dermatology</option>
            </select>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-blue-300 uppercase">Additional Message</label>
          <textarea
            name="message"
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-blue-400 transition resize-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
        >
          {loading ? "BOOKING..." : "CONFIRM APPOINTMENT"}
        </button>
      </form>
    </div>
  );
}
