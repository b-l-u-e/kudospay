import { useState } from "react";
import { registerCompany } from "../../api/companyApi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/common/Button";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hederaAccountId: "",
  });
 
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  

    try {
      const { data } = await registerCompany(formData);

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

      const { token, teamPool } = data;

      if (token && teamPool) {
        login(token, teamPool);
      }

      toast.success("Registration submitted for approval. Redirecting...");
      setTimeout(() => navigate("/pending-approval"), 2000);
    } catch (err) {
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
          Company Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              placeholder="0.0.xxxx"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
            />
          </div>
          <Button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#213555] hover:bg-[#213555]"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Do you have an account?{" "}
          <a href="/login" className="text-[#213555]  hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterCompany;
