function SearchBar() {
  return (
    <div className="flex justify-end mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="w-full sm:w-64 px-4 py-2 border rounded-md shadow-sm focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;