function Modal({ 
  showModal, 
  isEdit, 
  formData, 
  setFormData, 
  categories, 
  handleSubmit, 
  setShowModal 
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Link" : "Add New Link"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="url"
            placeholder="URL"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
          <select
            value={formData.category_id || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "new") {
                setFormData({
                  ...formData,
                  category_id: "",
                  newCategoryName: "",
                });
              } else {
                setFormData({
                  ...formData,
                  category_id: Number(value),
                  newCategoryName: "",
                });
              }
            }}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {formData.category_id === "" && (
            <input
              type="text"
              placeholder="New category name"
              value={formData.newCategoryName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  newCategoryName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md"
            >
              {isEdit ? "Update" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;