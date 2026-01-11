import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from backend
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-[-15deg] translate-x-1/2 -z-10" />

      <div className="max-w-[1400px] mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              World Class Specialists
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#1F2B6C] tracking-tight leading-[1.1]">
              Meet Our Highly <br />
              <span className="text-blue-600">Qualified Doctors</span>
            </h2>
            <p className="text-gray-500 text-lg mt-6 font-medium leading-relaxed">
              Our multidisciplinary team of experts is dedicated to providing you with the highest standard of personalized care and clinical excellence.
            </p>
          </div>

          <Link
            to="/doctors"
            className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 font-bold text-[#1F2B6C] active:scale-95"
          >
            Explore Full Directory
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
              →
            </div>
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-[500px] rounded-[40px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="px-4">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-20 doctors-swiper"
            >
              {doctors.map((doc) => (
                <SwiperSlide key={doc.id} className="pb-10">
                  <div className="group relative">
                    <Link to={`/doctors/${doc.id}`} className="block h-full cursor-pointer">
                      <div className="relative h-[500px] rounded-[40px] overflow-hidden bg-white shadow-xl transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(31,43,108,0.2)]">

                        {/* IMAGE */}
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={
                              doc.photo
                                ? `http://127.0.0.1:5000/uploads/doctors/${doc.photo}`
                                : "/images/doctor-placeholder.jpg"
                            }
                            alt={doc.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B6C] via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                        </div>

                        {/* BADGE */}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                            {doc.specialization || "Physician"}
                          </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                          <div className="flex flex-col gap-1 transform transition-all duration-500 group-hover:-translate-y-2">
                            <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-1">
                              {doc.department}
                            </p>
                            <h3 className="text-3xl font-black text-white leading-tight">
                              {doc.name}
                            </h3>

                            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mt-4">
                              <p className="text-blue-100/70 text-sm font-medium line-clamp-2">
                                {doc.experience} of clinical excellence.
                              </p>
                              <div className="flex gap-3 mt-6">
                                {['fb', 'tw', 'li'].map(social => (
                                  <div key={social} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-blue-500 border border-white/5 flex items-center justify-center text-white text-[10px] font-black uppercase transition-all">
                                    {social}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* HOVER BORDER EFFECT */}
                        <div className="absolute inset-0 border-[16px] border-white/0 group-hover:border-white/5 transition-all duration-500 rounded-[40px] pointer-events-none" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <style dangerouslySetInnerHTML={{
              __html: `
              .doctors-swiper .swiper-pagination-bullet { width: 12px; height: 12px; background: #1F2B6C; opacity: 0.2; }
              .doctors-swiper .swiper-pagination-bullet-active { width: 32px; border-radius: 6px; background: #2563eb; opacity: 1; }
            `}} />
          </div>
        )}

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-20 flex flex-col items-center justify-center p-12 rounded-[50px] bg-white border border-gray-100 shadow-sm text-center">
          <h4 className="text-2xl font-bold text-[#1F2B6C] mb-4">Can't find your preferred specialist?</h4>
          <p className="text-gray-500 font-medium mb-8 max-w-lg">We have over 50+ partner physicians across all major departments ready to assist you.</p>
          <div className="flex gap-4">
            <Link to="/contact" className="px-8 py-4 bg-gray-50 hover:bg-gray-100 text-[#1F2B6C] font-black rounded-2xl transition-all">Support Desk</Link>
            <Link to="/appointment" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200">Book Appointment</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
