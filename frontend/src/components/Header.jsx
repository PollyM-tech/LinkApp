import React from 'react';

function Header({ handleLogout }) {
  return (
    <header className="bg-white flex justify-between items-center px-6 py-4 shadow">
      <h1 className="text-3xl font-[cursive] text-black">Link App</h1>
      <button
        onClick={handleLogout}
        className="border border-sky-600 px-4 py-1 rounded hover:bg-blue-50 text-sm flex items-center gap-1 text-sky-700 cursor-pointer"
      >
        Log out
      </button>
    </header>
  );
}

export default Header;