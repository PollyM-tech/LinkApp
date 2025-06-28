import { Plus } from "lucide-react";

function FloatingIcon({ setShowModal, setIsEdit, setFormData }) {
  const handleClick = () => {
    setShowModal(true);
    setIsEdit(false);
    setFormData({
      id: null,
      title: "",
      url: "",
      description: "",
      category_id: "",
      newCategoryName: "",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 bg-white border border-blue-500 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
    >
      <Plus size={28} />
    </button>
  );
}

export default FloatingIcon;
