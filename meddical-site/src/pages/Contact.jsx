import PageBanner from "../components/PageBanner";
import NewsSection from "../components/NewsSection";

export default function Contact() {
  return (
    <>
      <PageBanner
                    title="Contact Us"
                    breadcrumb="Home / Contact"
                    image="/images/team-large1.svg"
      />
      <div className="w-1/2 mt-10 align-middle mx-auto">
        <iframe
          className="w-full h-[450px]"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24156.09023262827!2d-74.011276!3d40.721786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598b6b9cb49f%3A0xc80b8f06e177fe62!2sNew%20York!5e0!3m2!1sen!2sus!4v1700000000000"
          loading="lazy"
          allowFullScreen=""
        ></iframe>
      </div>
      <div>
        <div className="max-w-6xl mx-auto px-6 mt-16">
  {/* Header */}
  <p className="text-blue-600 uppercase tracking-wide font-semibold">Contact Us</p>
  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-8">
    Get in Touch with Our Team
  </h2>
  <p className="text-gray-700 mb-12 max-w-2xl">
    Have questions or need assistance? Our dedicated hospital team is ready to help you 24/7. Fill out the form or reach us via the contact info provided.
  </p>

  {/* Contact Form + Info Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* ---- FORM ---- */}
    <form className="md:col-span-2 bg-white shadow-xl p-8 rounded-3xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="text"
        placeholder="Subject"
        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Message"
        rows="5"
        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-500 hover:to-blue-600 transition-all duration-300">
        Submit
      </button>
    </form>

    {/* ---- INFO CARDS ---- */}
    <div className="space-y-6 bg-bluw-600">
      {/* Emergency */}
      <div className="bg-gradient-to-r from-red-400 to-red-500 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transform transition duration-300">
        <p className="font-bold text-lg mb-1">EMERGENCY</p>
        <p>(237) 681-812-255</p>
        <p>(237) 666-331-894</p>
      </div>

      {/* Location */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transform transition duration-300">
        <p className="font-bold text-lg mb-1">LOCATION</p>
        <p>0123 Some Place</p>
        <p>9876 Some Country</p>
      </div>

      {/* Email */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transform transition duration-300">
        <p className="font-bold text-lg mb-1">EMAIL</p>
        <p>fildineesoe@gmail.com</p>
        <p>mybestudios@gmail.com</p>
      </div>

      {/* Working Hours */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transform transition duration-300">
        <p className="font-bold text-lg mb-1">WORKING HOURS</p>
        <p>Mon-Sat 09:00-20:00</p>
        <p>Sunday Emergency Only</p>
       </div>
        </div>
       </div>
     </div>
      </div>
      <NewsSection />
    </>
  );
}
