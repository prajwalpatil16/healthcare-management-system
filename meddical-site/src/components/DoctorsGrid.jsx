import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DoctorsGrid() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="w-full py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h5 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2 text-center">
            Professional Team
          </h5>
          <h2 className="text-4xl font-bold text-[#1F2B6C] text-center">
            Our Medical Specialists
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <Link
              key={doc.id}
              to={`/doctors/${doc.id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden h-[340px]">
                <img
                  src={doc.photo ? `http://127.0.0.1:5001/uploads/doctors/${doc.photo}` : "/images/doctor-placeholder.jpg"}
                  alt={doc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B6C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="text-white">
                    <p className="text-sm font-medium text-blue-300">Available: Mon-Fri</p>
                  </div>
                </div>
              </div>

              <div className="p-8 text-center bg-white">
                <h3 className="text-2xl font-bold text-[#1F2B6C] mb-1 group-hover:text-blue-600 transition-colors">
                  {doc.name}
                </h3>
                <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4">
                  {doc.specialization || doc.department}
                </p>
                <div className="w-12 h-1 bg-blue-100 mx-auto rounded-full mb-4 transform group-hover:scale-x-150 transition-transform" />
                <p className="text-gray-500 text-sm italic">
                  {doc.experience} Experience
                </p>

                <button className="mt-6 w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  View Profile
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
