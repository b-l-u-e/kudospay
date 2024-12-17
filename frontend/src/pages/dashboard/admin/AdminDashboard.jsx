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
            console.log("Full Company Response:", companyRes);
    
            // Fetch all staff
            const staffRes = await getAllStaff();
            console.log("Full Staff Response:", staffRes);
    
          
    
            setCompanies(companyRes);
            setStaff(staffRes);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
    

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="p-8 bg-[#F5EFE7] text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-[#213555]">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-2">Companies</h2>
          <p className="text-lg mb-4">{companies.length} Registered</p>
          <button
            onClick={() => navigate("/admin/company")}
            className="bg-[#3E5879] text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
          >
            Manage Companies
          </button>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-2">Staff members</h2>
          <p className="text-lg mb-4">{staff.length} Registered</p>
          <button
            onClick={() => navigate("/admin/staff")}
            className="bg-[#3E5879] text-white px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
          >
            Manage Staff
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
