import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import SearchBar from "./SearchBar";
import LinkCard from "./LinkCard";
import Modal from "./Modal";
import FloatingIcon from "./FloatingIcon";

function Dashboard() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [expandSidebar, setExpandSidebar] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    url: "",
    description: "",
    category_id: "",
    newCategoryName: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    fetchCategories();
    fetchLinks();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/categories");
    setCategories(res.data);
  };

  const fetchLinks = async () => {
    const res = await axios.get("http://localhost:5000/links");
    setLinks(res.data);
    setFilteredLinks(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalCategoryId = formData.category_id;

    if (!formData.category_id && formData.newCategoryName) {
      const res = await axios.post("http://localhost:5000/categories", {
        name: formData.newCategoryName,
      });
      finalCategoryId = res.data.id;
      await fetchCategories();
    }

    const payload = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category_id: finalCategoryId,
    };

    if (isEdit) {
      await axios.patch(`http://localhost:5000/links/${formData.id}`, payload);
    } else {
      await axios.post("http://localhost:5000/links", payload);
    }

    setFormData({
      id: null,
      title: "",
      url: "",
      description: "",
      category_id: "",
      newCategoryName: "",
    });

    setShowModal(false);
    setIsEdit(false);
    fetchLinks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/links/${id}`);
    fetchLinks();
  };

  const handleEdit = (link) => {
    setFormData({
      ...link,
      newCategoryName: "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleCategoryFilter = (catId) => {
    setActiveCategory(catId);
    if (catId === "All") {
      setFilteredLinks(links);
    } else {
      setFilteredLinks(links.filter((link) => link.category_id === catId));
    }
  };

  const getLinkCount = (categoryId) =>
    links.filter((link) => link.category_id === categoryId).length;

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Unknown";
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-sky-400 flex flex-col">
      <Header handleLogout={handleLogout} />

      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar
          categories={categories}
          links={links}
          activeCategory={activeCategory}
          expandSidebar={expandSidebar}
          setExpandSidebar={setExpandSidebar}
          handleCategoryFilter={handleCategoryFilter}
          getLinkCount={getLinkCount}
        />

        <main className="flex-1 p-4 sm:p-6 relative">
          <SearchBar />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                getCategoryName={getCategoryName}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </div>

          <FloatingIcon
            setShowModal={setShowModal}
            setIsEdit={setIsEdit}
            setFormData={setFormData}
          />

          <Modal
            showModal={showModal}
            isEdit={isEdit}
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            handleSubmit={handleSubmit}
            setShowModal={setShowModal}
          />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;