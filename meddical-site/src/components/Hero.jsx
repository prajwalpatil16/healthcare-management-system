import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center bg-[#E5EEFF] overflow-hidden">

      {/* Decorative background circle */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 underline" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12 relative z-10">

        {/* LEFT CONTENT */}
        <div className="space-y-6 animate-fadeIn">
          <h5 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm">
            Caring for Life
          </h5>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1F2B6C] leading-[1.1]">
            Your Health is Our <br />
            <span className="text-blue-600">Top Priority</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md leading-relaxed">
            Experience world-class healthcare with a personal touch. Our dedicated team of specialists is here to support you at every stage of your wellness journey.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/appointment">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105">
                Our Services
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative hidden md:block animate-slideInRight">
          <div className="absolute inset-0 bg-blue-600/10 rounded-3xl rotate-3 scale-105 -z-10" />
          <img
            src="/images/HomePageHero.jpg"
            alt="Healthcare professionals"
            className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
          />

          {/* Floating stat box */}
          <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-2xl font-bold">❤</span>
            </div>
            <div>
              <p className="text-[#1F2B6C] font-bold text-xl">24/7</p>
              <p className="text-gray-500 text-xs">Emergency Care</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
