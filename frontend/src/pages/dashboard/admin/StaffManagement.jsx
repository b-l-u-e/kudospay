import { useState, useEffect } from "react";
import {
  registerStaff,
  activateStaff,
  deactivateStaff,
  getAllStaff,
} from "../../../api/staffApi";


const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    hederaAccountId: "",
  });
  const [loadingButton, setLoadingButton] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = async () => {
    try {
      const response = await getAllStaff();
      setStaff(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch staff.");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // Call the API to register the company
      await registerStaff(formData);
      setSuccess("Staff registered successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        companyId: "",
        hederaAccountId: "",
      });
      fetchStaff();
    } catch (err) {
      console.error(
        "Error registering staff:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.error || "Failed to register staff.");
    }
  };

  //   const handleDelete = async (id) => {
  //     try {
  //       await deleteStaff(id);
  //       setSuccess("Staff member deleted successfully!");
  //       setStaff((prev) => prev.filter((member) => member._id !== id));
  //     } catch (err) {
  //       setError(err.response?.data?.error || "Failed to delete staff.");
  //     }
  //   };

  const handleActivate = async (id) => {
    try {
      setLoadingButton(id);
      await activateStaff(id);
      setSuccess("Staff member activated successfully!");
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to activate staff.");
    } finally {
      setLoadingButton(null);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateStaff(id);
      setSuccess("Staff member deactivated successfully!");
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to deactivate staff.");
    } finally {
      setLoadingButton(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      {/* Feedback Messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Staff Registration/Update Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="hederaAccountId"
          value={formData.hederaAccountId}
          onChange={handleChange}
          placeholder="Hedera Account ID"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register staff
        </button>
      </form>

      {/* staff List */}
      <h2 className="text-xl font-semibold mb-4">Staff List</h2>
            {staff.length > 0 ? (
                <ul>
                    {staff.map((staff) => (
                        <li
                            key={staff._id}
                            className="border-b py-2 flex justify-between items-center"
                        >
                            <span>
                                {staff.name} - {staff.email} - {staff.status}
                            </span>
                            <div>
                                {staff.status === "inactive" ? (
                                    <button
                                        onClick={() => handleActivate(staff._id)}
                                        className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ${
                                            loadingButton === staff._id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={loadingButton === staff._id}
                                    >
                                        {loadingButton === staff._id ? "Activating..." : "Activate"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleDeactivate(staff._id)}
                                        className={`bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ${
                                            loadingButton === staff._id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={loadingButton === staff._id}
                                    >
                                        {loadingButton === staff._id ? "Deactivating..." : "Deactivate"}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No companies registered yet.</p>
            )}
    </div>
  );
};

export default StaffManagement;
