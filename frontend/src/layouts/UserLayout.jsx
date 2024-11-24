import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// eslint-disable-next-line react/prop-types
const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow bg-gray-100 p-4">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default UserLayout;
