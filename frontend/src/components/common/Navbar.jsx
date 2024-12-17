import { useState } from "react";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <nav className="bg-[#213555] text-white px-6 py-3 flex items-center justify-between">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden focus:outline-none"
      >
        <FiMenu size={24} />
      </button>

      {/* Title */}
      <div className="text-2xl font-bold">KudosPay</div>

      {/* Right Section */}
      <div>
        <button
          className="hover:underline"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
