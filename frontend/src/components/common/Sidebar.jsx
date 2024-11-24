/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Sidebar = ({ links }) => {
    return (
        <aside className="bg-gray-200 w-64 h-screen fixed">
            <div className="p-4 text-center bg-blue-500 text-white font-bold">
                KudosPay Admin
            </div>
            <ul className="mt-4">
                {links.map((link, index) => (
                    <li key={index} className="py-2 px-4 hover:bg-blue-100">
                        <Link to={link.path} className="text-gray-700">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
