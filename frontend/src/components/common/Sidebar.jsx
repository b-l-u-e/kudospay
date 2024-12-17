import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // For icons
import PropTypes from "prop-types";
const Sidebar = ({ links }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`${
                isCollapsed ? "w-16" : "w-64"
            } bg-gray-800 h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out text-white`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white focus:outline-none"
                >
                    {isCollapsed ? <FiMenu /> : <FiX />}
                </button>
            </div>

            {/* Sidebar Links */}
            <ul className="mt-4">
                {links.map((link, index) => (
                    <li key={index} className="mb-2">
                        <Link
                            to={link.path}
                            className="flex items-center px-4 py-2 hover:bg-[#3E5879] rounded transition"
                        >
                            <span className={`${isCollapsed ? "hidden" : "inline"}`}>
                                {link.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

Sidebar.propTypes = {
    links: PropTypes.node,
};



export default Sidebar;
