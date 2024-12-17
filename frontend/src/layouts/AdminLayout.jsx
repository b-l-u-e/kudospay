import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  

    return (
        <div className="flex">
        

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow bg-[#F5EFE7] min-h-screen transition-all duration-300">
                <Navbar />
                <main className="p-6 overflow-auto flex-grow">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

// Add prop types validation
AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminLayout;
