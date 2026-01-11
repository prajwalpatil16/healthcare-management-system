import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Doctors from "../components/Doctors";

export default function NewsPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;

  if (!article)
    return <h2 className="text-center py-20 text-3xl">Article Not Found</h2>;

  return (<>
    <section className="bg-gray-50">
      {/* HERO IMAGE */}
      <div className="w-full h-[420px] overflow-hidden">
        <img
          src={`http://127.0.0.1:5000/uploads/news/${article.image}`}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* META */}
        <p className="text-sm text-gray-500 mb-3">
          {new Date(article.created_at).toDateString()} • By {article.author}
        </p>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-[#1F2B6C] mb-6 leading-tight">
          {article.title}
        </h1>

        {/* CONTENT */}
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </section>
    </>
  );
}
