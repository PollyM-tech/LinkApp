import { ChevronDown, ChevronRight } from "lucide-react";

function Sidebar({ 
  categories, 
  links, 
  activeCategory, 
  expandSidebar, 
  setExpandSidebar, 
  handleCategoryFilter, 
  getLinkCount 
}) {
  return (
    <aside className="w-full md:w-64 bg-white p-4 shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpandSidebar(!expandSidebar)}
      >
        <h2 className="text-lg font-semibold mb-2">My Categories</h2>
        {expandSidebar ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>
      {expandSidebar && (
        <ul className="mt-2 space-y-2 text-sm text-gray-800">
          <li
            className={`flex justify-between cursor-pointer ${
              activeCategory === "All" ? "font-bold" : ""
            }`}
            onClick={() => handleCategoryFilter("All")}
          >
            <span>All</span>
            <span>{links.length}</span>
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => handleCategoryFilter(cat.id)}
              className={`flex justify-between cursor-pointer ${
                activeCategory === cat.id ? "font-bold" : ""
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-gray-500">{getLinkCount(cat.id)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;