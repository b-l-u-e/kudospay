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
            alert("Company activated successfully!");
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
            alert("Company deactivated successfully!");
            fetchCompanies(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.error || "Failed to deactivate company.");
        } finally {
            setLoadingButton(null); // Reset loading state
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Company Management</h1>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            {/* Company Registration Form */}
            <form onSubmit={handleSubmit} className="mb-6">
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
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    
                >
                    Register company
                </button>
            </form>

             {/* Company List */}
             <h2 className="text-xl font-semibold mb-4">Company List</h2>
            {companies.length > 0 ? (
                <ul>
                    {companies.map((company) => (
                        <li
                            key={company._id}
                            className="border-b py-2 flex justify-between items-center"
                        >
                            <span>
                                {company.name} - {company.email} - {company.status}
                            </span>
                            <div>
                                {company.status === "inactive" ? (
                                    <button
                                        onClick={() => handleActivate(company._id)}
                                        className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ${
                                            loadingButton === company._id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={loadingButton === company._id}
                                    >
                                        {loadingButton === company._id ? "Activating..." : "Activate"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleDeactivate(company._id)}
                                        className={`bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ${
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
                <p>No companies registered yet.</p>
            )}
        </div>
    );
};

export default CompanyManagement;
