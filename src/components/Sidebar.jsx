import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar({ onLogout }) {  // receive logout function as prop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-[250px] flex-shrink-0 bg-[#0e1421] text-white p-4 sticky left-0 top-0 min-h-screen">
        <nav className="flex flex-col space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 w-full"
          >
            <img src="assets/dashboard.png" alt="Dashboard" className="w-6 h-6 max-w-full" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/soil"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 w-full"
          >
            <img src="assets/Soy Bean.png" alt="Crop Recommendation" className="w-6 h-6 max-w-full" />
            <span>Crop Recommendation</span>
          </Link>
          <button
            className="px-4 py-2 rounded bg-[#FF6B6B] hover:bg-[#E55A5A] text-center"
            onClick={() => alert("Pump Control Clicked!")}
          >
            Control Pump
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-center"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Top Bar */}
      <div className="w-full lg:hidden flex items-center justify-between p-2.5 bg-[#0e1421] text-white">
        <div onClick={() => setMobileMenuOpen(true)} className="focus:outline-none">
          <img src="assets/menu.png" alt="Menu" className="scale-x-[-1]" />
        </div>
        <h1 className="text-[2rem]! md:text-lg font-bold">Dashboard</h1>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0e1421] text-white z-50 flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-bold">Menu</h1>
            <button onClick={() => setMobileMenuOpen(false)}>
              <img src="assets/cross.png" alt="Close" className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10"
            >
              <img src="assets/dashboard.png" alt="Dashboard" className="w-6 h-6 max-w-full" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/soil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10"
            >
              <img src="assets/Soy Bean.png" alt="Crop Recommendation" className="w-6 h-6 max-w-full" />
              <span>Crop Recommendation</span>
            </Link>
            <button
              className="px-4 py-2 rounded bg-[#FF6B6B] hover:bg-[#E55A5A] text-center"
              onClick={() => alert("Pump Control Clicked!")}
            >
              Control Pump
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-center"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

export default Sidebar;