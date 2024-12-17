import { useState, useEffect } from "react";
import { registerStaff } from "../../api/staffApi";
import { getAllCompanies } from "../../api/companyApi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/common/Button";

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    companyId: "",
    hederaAccountId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true); // Loading state for companies
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /** Fetch list of active companies */
useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const companies = await getAllCompanies(); // companies is now an array
      console.log("Companies:", companies);

      const activeCompanies = companies.filter((company) => company.isActive);

      if (activeCompanies.length === 0) {
        toast.warn("No active companies available yet.");
      }
      setCompanies(activeCompanies);
    } catch (err) {
      console.error("Error fetching companies:", err);
      toast.error("Failed to load companies. Please try again later.");
    } finally {
      setLoadingCompanies(false);
    }
  };

  fetchCompanies();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   

    try {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (
        formData.hederaAccountId &&
        !/^0\.0\.[0-9]+$/.test(formData.hederaAccountId)
      ) {
        toast.error("Please enter a valid Hedera Account ID (e.g., 0.0.xxxx).");
        return;
      }

      const { data } = await registerStaff(formData);
      const { token, staff } = data;

      if (token && staff) {
        login(token, staff);
      }

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/pending-approval"), 2000);
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5EFE7]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-[#213555] mb-6">
          Staff Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
              required
            />
          </div>

          <div>
            <label htmlFor="hederaAccountId" className="block text-sm font-medium">
              Hedera Account ID (optional)
            </label>
            <input
              type="text"
              id="hederaAccountId"
              name="hederaAccountId"
              value={formData.hederaAccountId}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
              placeholder="0.0.xxxx"
            />
          </div>

          <div>
            <label htmlFor="companyId" className="block text-sm font-medium">
              Select Company
            </label>
            {loadingCompanies ? (
              <p className="text-sm text-gray-500 mt-2">Loading companies...</p>
            ) : companies.length ? (
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-500 mt-2">
                No active companies found. Please try again later.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3E5879] hover:bg-[#213555]"
            }`}
            disabled={loading || loadingCompanies}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Do you have an account?{" "}
          <a href="/login" className="text-[#3E5879] hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterStaff;
