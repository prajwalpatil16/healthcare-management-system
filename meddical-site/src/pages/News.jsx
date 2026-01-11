import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  // -----------------------------
  // FETCH NEWS FROM BACKEND
  // -----------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/news")
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error("News fetch error:", err));
  }, []);

  return (
    <>
      {/* PAGE BANNER (UNCHANGED) */}
      <PageBanner
        title="Our News"
        breadcrumb="Home / News"
        image="/images/doctor-blur.svg"
      />

      {/* NEWS LIST */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {newsList.length === 0 && (
          <p className="text-center text-gray-500">
            No news available
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <Link
              key={news.id}
              to={`/news/${news.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGE */}
              {news.image && (
                <img
                  src={`http://127.0.0.1:5000/uploads/news/${news.image}`}
                  alt={news.title}
                  className="w-full h-56 object-cover"
                />
              )}

              {/* CONTENT */}
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(news.created_at).toDateString()} • {news.author}
                </p>

                <h3 className="text-xl font-bold text-[#1F2B6C] mb-3">
                  {news.title}
                </h3>

                <p className="text-gray-600 line-clamp-3">
                  {news.content}
                </p>

                <span className="inline-block mt-4 text-blue-600 font-semibold">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
