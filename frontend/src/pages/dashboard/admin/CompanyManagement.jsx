import { useState, useEffect } from "react";
import {
    getAllCompanies,
    registerCompany,
    activateCompany,
    deactivateCompany,
} from "../../../api/companyApi";

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        hederaAccountId: "",
    });
    const [loadingButton, setLoadingButton] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch companies function
    const fetchCompanies = async () => {
        try {
            const response = await getAllCompanies();
            setCompanies(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching companies:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to fetch companies.");
        }
    };

    useEffect(() => {
        fetchCompanies(); // Call fetchCompanies when component loads
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission to register a company
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setSuccess("");

            // Call the API to register the company
            await registerCompany(formData);
            setSuccess("Company registered successfully!");
            setFormData({
                name: "",
                email: "",
                password: "",
                hederaAccountId: "",
            });

            fetchCompanies(); // Refresh the company list
        } catch (err) {
            console.error("Error registering company:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to register company.");
        }
    };

    // Handle activating a company
    const handleActivate = async (id) => {
        try {
            setLoadingButton(id);
            await activateCompany(id);
            setSuccess("Company activated successfully!");
            fetchCompanies(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to activate company.");
        } finally {
            setLoadingButton(null); // Reset loading state
        }
    };

    // Handle deactivating a company
    const handleDeactivate = async (id) => {
        try {
            setLoadingButton(id);
            await deactivateCompany(id);
            setSuccess("Company deactivated successfully!");
            fetchCompanies(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to deactivate company.");
        } finally {
            setLoadingButton(null); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Management</h1>

                {/* Error Message */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Success Message */}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                {/* Company Registration Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Register a New Company</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Company Name"
                            required
                            className="border rounded p-2"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Business Email"
                            required
                            className="border rounded p-2"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="border rounded p-2"
                        />
                        <input
                            type="text"
                            name="hederaAccountId"
                            value={formData.hederaAccountId}
                            onChange={handleChange}
                            placeholder="Hedera Account ID (optional)"
                            className="border rounded p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Register Company
                    </button>
                </form>

                {/* Company List */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Company List</h2>
                    {companies.length > 0 ? (
                        <ul className="space-y-4">
                            {companies.map((company) => (
                                <li
                                    key={company._id}
                                    className="flex justify-between items-center bg-gray-50 p-4 rounded shadow-sm"
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">{company.name}</p>
                                        <p className="text-sm text-gray-600">{company.email}</p>
                                        <p
                                            className={`text-sm font-medium ${
                                                company.status === "inactive" ? "text-red-500" : "text-green-500"
                                            }`}
                                        >
                                            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                        </p>
                                    </div>
                                    <div>
                                        {company.status === "inactive" ? (
                                            <button
                                                onClick={() => handleActivate(company._id)}
                                                className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition ${
                                                    loadingButton === company._id ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                disabled={loadingButton === company._id}
                                            >
                                                {loadingButton === company._id ? "Activating..." : "Activate"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDeactivate(company._id)}
                                                className={`bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition ${
                                                    loadingButton === company._id ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                disabled={loadingButton === company._id}
                                            >
                                                {loadingButton === company._id ? "Deactivating..." : "Deactivate"}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No companies registered yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyManagement;
