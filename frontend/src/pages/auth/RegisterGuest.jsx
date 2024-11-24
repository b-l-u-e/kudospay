import { useState } from "react";
import { registerGuest } from "../../api/guestApi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RegisterGuest = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    hederaAccountId: "", // Optional input
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setError("");
    setSuccess("");

    console.log("Submitting form data:", formData);

    try {
      console.log("Submitting registration data:", formData);
      // Call the backend API for guest registration
      const { data } = await registerGuest(formData);

      const {token, guest} = data

      if(token && guest) {
        login(token, guest);
      }

      setSuccess("Registration successful! Redirecting...");
      // Store the token and user data in AuthContext
      

      // Redirect to the guest dashboard after registration
      setTimeout(() => navigate("/guest/dashboard"), 2000);
    } catch (err) {
      // Handle errors from the backend
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Guest Registration
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
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
              className="w-full mt-1 p-2 border rounded"
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
              className="w-full mt-1 p-2 border rounded"
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
              className="w-full mt-1 p-2 border rounded"
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
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Do you have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterGuest;
