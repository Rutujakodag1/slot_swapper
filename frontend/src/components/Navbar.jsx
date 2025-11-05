import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // using icons from lucide-react
import React, { useState } from "react";
export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

 return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Brand */}
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold tracking-wide cursor-pointer hover:scale-105 transition-transform"
          >
            SlotSwapper
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              to="/dashboard"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              to="/requests"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Requests
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="flex flex-col space-y-3 pb-4 md:hidden animate-slide-down">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-3 rounded hover:bg-blue-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-3 rounded hover:bg-blue-500 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/requests"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-3 rounded hover:bg-blue-500 transition-colors"
            >
              Requests
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm font-semibold w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
