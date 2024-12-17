import { useState } from "react";
import { registerGuest } from "../../api/guestApi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/common/Button";

const RegisterGuest = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    hederaAccountId: "", // Optional input
  });
  const [error, setError] = useState("");
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
      const { data } = await registerGuest(formData);

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
    
      if (
        formData.hederaAccountId &&
        !/^0\.0\.[0-9]+$/.test(formData.hederaAccountId)
      ) {
        setError("Please enter a valid Hedera Account ID (e.g., 0.0.xxxx).");
        return;
      }
      
      const { token, guest } = data;

      if (token && guest) {
        login(token, guest);
      }

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/guest/dashboard"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5EFE7]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-[#213555] mb-6">
          Guest Registration
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Optional Hedera Account ID */}
          <div>
            <label
              htmlFor="hederaAccountId"
              className="block text-sm font-medium"
            >
              Hedera Account ID (optional)
            </label>
            <input
              type="text"
              id="hederaAccountId"
              name="hederaAccountId"
              placeholder="0.0.xxxx"
              value={formData.hederaAccountId}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#213555]"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3E5879] hover:bg-[#213555]"
            }`}
            disabled={loading}
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

export default RegisterGuest;
