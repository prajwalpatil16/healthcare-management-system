import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function NewsSection() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/news")
      .then((res) => res.json())
      .then(setNews)
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h5 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">
            Stay Updated
          </h5>
          <h2 className="text-4xl font-bold text-[#1F2B6C]">
            Health Articles & News
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {news.map((n) => (
            <SwiperSlide key={n.id}>
              <Link to={`/news/${n.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={n.image ? `http://127.0.0.1:5000/uploads/news/${n.image}` : "/images/news-placeholder.jpg"}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                        Health
                      </span>
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1F2B6C] group-hover:text-blue-600 transition-colors line-clamp-2">
                      {n.title}
                    </h3>

                    <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                      {n.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>

                    <div className="mt-6 flex items-center text-blue-600 font-bold gap-2">
                      Read More
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-10">
          <Link to="/news">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-3 rounded-lg font-bold transition-all">
              View All News
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
