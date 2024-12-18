import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../api/authApi";
import logo from "../../assets/Kudos.png"
import Button from "../../components/common/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data;

      if (!token || !user || !user.role) {
        throw new Error(
          "Invalid response from server. Missing token or user role."
        );
      }

      login(token, user);

      if (user.status === "inactive") {
        navigate("/pending-approval");
      } else {
        switch (user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "teamPool":
            navigate("/company/dashboard");
            break;
          case "guest":
            navigate("/guest/dashboard");
            break;
          default:
            navigate("/login");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5EFE7]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img src={logo} alt="KudosPay Logo" className="w-40 h-20 object-cover" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-[#213555] mb-6">
          Welcome Back!
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213555]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213555]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white font-bold py-2 rounded-lg hover:bg-[#213555] transition duration-200"
          >
            Login
          </Button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register/guest"
            className="text-[#213555] font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
