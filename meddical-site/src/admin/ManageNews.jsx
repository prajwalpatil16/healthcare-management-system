import { useEffect, useState } from "react";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [image, setImage] = useState(null);

  const loadNews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("author", form.author);
    if (image) fd.append("image", image);

    const res = await fetch("http://127.0.0.1:5001/api/admin/news", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: fd,
    });

    if (res.ok) {
      setShowForm(false);
      setForm({ title: "", content: "", author: "" });
      setImage(null);
      loadNews();
    } else {
      alert("Failed to publish news article.");
    }
  };

  const deleteNews = async (id) => {
    if (!confirm("Are you sure you want to remove this news article?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:5001/api/admin/news/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      loadNews();
    }
  };

  if (loading) return <div className="p-8 text-[#1F2B6C] font-bold animate-pulse">Fetching Latest Articles...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2B6C]">News & Articles</h1>
          <p className="text-gray-500 font-medium mt-1">Broadcast important health updates and hospital news.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Create New Article
        </button>
      </div>

      {/* NEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((n) => (
          <div key={n.id} className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src={n.image ? `http://127.0.0.1:5001/uploads/news/${n.image}` : "/images/news-placeholder.jpg"}
                alt={n.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <button onClick={() => deleteNews(n.id)} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white shadow-sm transition-all">
                  🗑️
                </button>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded-full uppercase tracking-widest">Article</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>

              <h3 className="text-xl font-bold text-[#1F2B6C] mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">{n.title}</h3>

              <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                {n.content?.replace(/<[^>]*>/g, '')}
              </p>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-[#1F2B6C]">
                    {n.author?.charAt(0) || "A"}
                  </div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{n.author || "Admin"}</p>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">Edit Content</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1F2B6C]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white/20">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-[#1F2B6C] mb-8">Compose Article</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Article Title</label>
                <input
                  placeholder="Enter a compelling title..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Authorship</label>
                <input
                  placeholder="Writer's name..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-[#1F2B6C]"
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Main Content</label>
                <textarea
                  placeholder="Write your article here..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700 h-48 resize-none"
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 text-center block">Cover Illustration</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-gray-100 rounded-[32px] cursor-pointer hover:bg-gray-50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">Pick a professional image</p>
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{image ? image.name : "PNG, JPG Only"}</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-5 bg-gray-100 text-gray-500 rounded-3xl font-extrabold hover:bg-gray-200 transition-all">
                  Discard
                </button>
                <button className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-3xl font-extrabold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
