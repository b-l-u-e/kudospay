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

    const fetchCompanies = async () => {
        try {
            const response = await getAllCompanies();
            setCompanies(response);
            setError("");
        } catch (err) {
            console.error("Error fetching companies:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to fetch companies.");
        }
    };

    useEffect(() => {
        fetchCompanies();
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

            await registerCompany(formData);
            setSuccess("Company registered successfully!");
            setFormData({
                name: "",
                email: "",
                password: "",
                hederaAccountId: "",
            });
            fetchCompanies();
        } catch (err) {
            console.error("Error registering company:", err.response?.error || err.message);
            setError(err.response?.data?.error || "Failed to register company.");
        }
    };

    const handleActivate = async (id) => {
        try {
            setLoadingButton(id);
            await activateCompany(id);
            setSuccess("Company activated successfully!");
            fetchCompanies();
        } catch (err) {
            setError(err.response?.error || "Failed to activate company.");
        } finally {
            setLoadingButton(null);
        }
    };

    const handleDeactivate = async (id) => {
        try {
            setLoadingButton(id);
            await deactivateCompany(id);
            setSuccess("Company deactivated successfully!");
            fetchCompanies();
        } catch (err) {
            setError(err.response?.error || "Failed to deactivate company.");
        } finally {
            setLoadingButton(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Register a New Company
                    </h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Company Name"
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Business Email"
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="hederaAccountId"
                            value={formData.hederaAccountId}
                            onChange={handleChange}
                            placeholder="Hedera Account ID (optional)"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Register Company
                        </button>
                    </form>
                </div>

                {/* Company List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Company List
                    </h2>
                    {companies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companies.map((company) => (
                                <div
                                    key={company._id}
                                    className="bg-gray-50 rounded-lg shadow p-4 flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{company.email}</p>
                                        <p
                                            className={`text-sm font-medium ${
                                                company.status === "inactive"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {company.status.charAt(0).toUpperCase() +
                                                company.status.slice(1)}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {company.status === "inactive" ? (
                                            <button
                                                onClick={() => handleActivate(company._id)}
                                                className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ${
                                                    loadingButton === company._id
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                disabled={loadingButton === company._id}
                                            >
                                                {loadingButton === company._id
                                                    ? "Activating..."
                                                    : "Activate"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDeactivate(company._id)}
                                                className={`bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ${
                                                    loadingButton === company._id
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                disabled={loadingButton === company._id}
                                            >
                                                {loadingButton === company._id
                                                    ? "Deactivating..."
                                                    : "Deactivate"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No companies registered yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyManagement;
