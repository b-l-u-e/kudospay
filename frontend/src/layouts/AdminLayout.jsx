import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Sidebar from "../components/common/Sidebar";

// eslint-disable-next-line react/prop-types
const AdminLayout = ({ children }) => {
    const adminLinks = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Users", path: "/admin/users" },
        { label: "Companies", path: "/admin/companies" },
        { label: "Settings", path: "/admin/settings" },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar links={adminLinks} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow">
                <Navbar />
                <main className="p-4 flex-grow bg-gray-100">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
