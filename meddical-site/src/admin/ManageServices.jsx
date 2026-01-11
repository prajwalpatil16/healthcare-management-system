import { useState } from "react";

export default function ManageServices() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [services, setServices] = useState([
    { id: 1, name: "Cardiology", description: "Heart checkup & ECG services", icon: "❤️" },
    { id: 2, name: "Neurology", description: "Brain & nerve treatment", icon: "🧠" },
    { id: 3, name: "Orthopedics", description: "Bone & joint care", icon: "🦴" },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingService(null);
    setForm({ name: "", description: "", icon: "" });
    setShowForm(true);
  };

  const openEditForm = (svc) => {
    setEditingService(svc);
    setForm(svc);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingService) {
      // update
      setServices(
        services.map((s) =>
          s.id === editingService.id ? { ...s, ...form } : s
        )
      );
    } else {
      // add
      setServices([...services, { id: Date.now(), ...form }]);
    }

    setShowForm(false);
  };

  const deleteService = (id) => {
    if (confirm("Are you sure?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Services</h2>

        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add Service
        </button>
      </div>

      {/* SERVICE TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Icon</th>
              <th className="p-4 text-left">Service Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((svc) => (
              <tr key={svc.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-2xl">{svc.icon}</td>
                <td className="p-4 font-semibold">{svc.name}</td>
                <td className="p-4 text-gray-600">{svc.description}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => openEditForm(svc)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(svc.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl w-96 shadow-xl">

            <h3 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />

              <textarea
                name="description"
                placeholder="Service Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded h-24"
              ></textarea>

              <input
                type="text"
                name="icon"
                placeholder="Emoji Icon (optional)"
                value={form.icon}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingService ? "Update" : "Add Service"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
