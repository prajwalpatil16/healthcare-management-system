import { useParams, Link } from "react-router-dom";
import { specialtiesData } from "../data/specialtiesData";

export default function SpecialtyPage() {
  const { name } = useParams();
  const specialty = specialtiesData[name];
  const allSpecialties = Object.keys(specialtiesData);

  if (!specialty) return <div className="py-20 text-center">Specialty not found</div>;

  return (
    <div className="pb-24 bg-[#F8FAFC]">

      {/* HERO SECTION */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src={specialty.heroImage}
          className="w-full h-full object-cover"
          alt={specialty.title}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2B6C]/90 to-transparent flex items-center px-6 md:px-24">
          <div className="max-w-2xl animate-fadeIn">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
              Medical Specialty
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-6 transition-all">
              {specialty.title}
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed opacity-90">
              Leading the way in specialized {specialty.title.toLowerCase()} care with advanced technology and expert doctors.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-16 relative z-20">

        {/* SIDEBAR - Left side (4 columns on large screens) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 sticky top-24">
            <div className="bg-[#1F2B6C] p-6">
              <h4 className="text-white font-bold text-xl">All Specialties</h4>
            </div>

            <div className="p-4 flex flex-col gap-2">
              {allSpecialties.map((sp) => (
                <Link
                  to={`/specialty/${sp}`}
                  className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-between group ${sp === name
                      ? "bg-blue-50 text-blue-600 shadow-inner"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                  key={sp}
                >
                  {specialtiesData[sp].title}
                  <span className={`transition-transform duration-300 ${sp === name ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact help box */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
            <h4 className="text-2xl font-bold mb-4">Need Help?</h4>
            <p className="text-blue-100 mb-6">Contact our professionals for any inquiries or to schedule a consultation.</p>
            <Link to="/contact">
              <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT - Right side (8 columns on large screens) */}
        <main className="lg:col-span-8 space-y-10">

          {/* DESCRIPTION */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-[#1F2B6C] mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-blue-600 rounded-full" />
              Overview
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
              {specialty.description}
            </p>
          </div>

          {/* HIGHLIGHTS */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-[#1F2B6C] mb-6">Key Highlights</h3>
              <ul className="space-y-4">
                {specialty.achievements?.map((ach, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-600 font-medium">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-10 rounded-[40px] shadow-sm border border-blue-100 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#1F2B6C] mb-4">Quality Care</h3>
              <p className="text-[#1F2B6C]/70">We are committed to providing the highest quality healthcare with a focus on patient safety and satisfaction.</p>
            </div>
          </div>

          {/* DOCTORS */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-[#1F2B6C] flex items-center gap-3">
              <span className="w-10 h-1 bg-blue-600 rounded-full" />
              Specialized Doctors
            </h3>

            <div className="grid sm:grid-cols-2 gap-8">
              {specialty.doctors?.map((doc, i) => (
                <div
                  key={i}
                  className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-2xl h-64 mb-6">
                    <img
                      src={doc.img}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={doc.name}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-[#1F2B6C]">{doc.name}</h4>
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">{doc.role}</p>
                  <p className="text-gray-500 text-sm mt-3 pb-4 border-b border-gray-100">{doc.experience}</p>
                  <Link to={`/doctors/${doc.name.replace(/\s+/g, '-').toLowerCase()}`} className="mt-4 inline-block text-blue-600 font-bold hover:underline">
                    View Profile →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
