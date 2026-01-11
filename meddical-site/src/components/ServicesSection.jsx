import { Link } from "react-router-dom";

export default function ServicesSection() {
  const services = [
    {
      key: "free-checkup",
      title: "Free Health Checkup",
      desc: "Annual preventive checkups including vitals, BMI, blood tests, and doctor consultation.",
      icon: "/icons/checkup.png",
      tag: "Preventive"
    },
    {
      key: "cardiovascular",
      title: "Cardiology & Heart Care",
      desc: "Advanced ECG, ECHO, stress tests, and specialist consultations for heart diseases.",
      icon: "/icons/heart.svg",
      tag: "Critical Care"
    },
    {
      key: "bones",
      title: "Orthopedics & Joint Care",
      desc: "Bone, spine, and joint treatments with digital X-rays and physiotherapy support.",
      icon: "/icons/bone.png",
      tag: "Surgery"
    },
    {
      key: "pediatrics",
      title: "Pediatrics & Child Care",
      desc: "Comprehensive care for infants, children, and teens including vaccinations.",
      icon: "/icons/baby.png",
      tag: "Family"
    },
    {
      key: "neurology",
      title: "Neurology & Brain Care",
      desc: "Diagnosis of migraines, epilepsy, stroke, and nerve disorders using advanced imaging.",
      icon: "/icons/brain.png",
      tag: "Neurological"
    },
    {
      key: "blood-bank",
      title: "24/7 Blood Bank",
      desc: "Safe blood collection, processing, and emergency supply of all blood groups.",
      icon: "/icons/blood.svg",
      tag: "Emergency"
    },
    {
      key: "diagnostics",
      title: "Diagnostics & Imaging",
      desc: "CT scan, MRI, ultrasound, digital X-ray, and lab services under one roof.",
      icon: "/icons/scan.png",
      tag: "Diagnostic"
    },
    {
      key: "gynaecology",
      title: "Maternity & Women’s Health",
      desc: "Pregnancy care, deliveries, fertility services, and gynecology consultations.",
      icon: "🤰", // Placeholder as quota exhausted
      tag: "Maternity"
    },
    {
      key: "oncology",
      title: "Cancer Care (Oncology)",
      desc: "Chemotherapy, radiation therapy, and specialized cancer consultations.",
      icon: "🎗️", // Placeholder as quota exhausted
      tag: "Specialized"
    },
  ];

  return (
    <section className="w-full py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">

        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 px-4">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">Medical Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F2B6C] leading-tight">
              Comprehensive Care <br />
              <span className="text-blue-600">Tailored to You.</span>
            </h2>
          </div>
          <p className="max-w-md text-gray-500 font-medium text-lg leading-relaxed">
            Leveraging state-of-the-art technology and clinical expertise to deliver excellence in every department.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => (
            <Link
              to={`/services/${item.key}`}
              key={item.key}
              className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background Subtle Hover Circle */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-50 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-0 group-hover:opacity-100" />

              <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black uppercase text-blue-600/40 tracking-widest">{item.tag}</span>
                  <div className="w-2 h-2 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors" />
                </div>

                <div className="w-24 h-24 bg-blue-50/50 rounded-3xl flex items-center justify-center mb-10 mx-auto group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                  {typeof item.icon === 'string' && item.icon.startsWith('/') ? (
                    <img
                      src={item.icon}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500"
                      alt={item.title}
                    />
                  ) : (
                    <span className="text-4xl group-hover:scale-120 transition-transform duration-500">{item.icon}</span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-[#1F2B6C] mb-4 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8 opacity-70">
                  {item.desc}
                </p>

                <div className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  Clinical Overview
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-24 text-center">
          <Link to="/contact" className="px-12 py-5 bg-[#1F2B6C] text-white rounded-[30px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:-translate-y-1 active:scale-95 transition-all inline-block">
            Inquiry Special Request
          </Link>
        </div>
      </div>
    </section>
  );
}
