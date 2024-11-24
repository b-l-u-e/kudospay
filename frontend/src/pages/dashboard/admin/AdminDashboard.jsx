import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCompanies } from "../../../api/companyApi";
import { getAllStaff } from "../../../api/staffApi";

const AdminDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch companies
                const companyRes = await getAllCompanies();
                setCompanies(companyRes.data);

                // Fetch all staff
                const staffRes = await getAllStaff()
                setStaff(staffRes.data)


                // // Fetch staff only if companies exist
                // if (companyRes.data.length > 0 && companyRes.data[0].id) {
                //     const staffRes = await getStaffByCompany(companyRes.data[0].id);
                //     setStaff(staffRes.data);
                // } else {
                //     setStaff([]);
                // }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="p-8 bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 min-h-screen text-white">
            <h1 className="text-4xl font-extrabold mb-6 text-center">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                    <h2 className="text-2xl font-bold mb-2">Companies</h2>
                    <p className="text-lg mb-4">{companies.length} Registered</p>
                    <button
                        onClick={() => navigate("/admin/company")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
                    >
                        Manage Companies
                    </button>
                </div>
                <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                    <h2 className="text-2xl font-bold mb-2">Staff</h2>
                    <p className="text-lg mb-4">{staff.length} Registered</p>
                    <button
                        onClick={() => navigate("/admin/staff")}
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
                    >
                        Manage Staff
                    </button>
                </div>
                <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                    <h2 className="text-2xl font-bold mb-2">Guests</h2>
                    <p className="text-lg mb-4">Placeholder for Guest Count</p>
                    <button
                        onClick={() => navigate("/admin/guest")}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
                    >
                        Manage Guests
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
