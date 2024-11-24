import API from "./axiosConfig";

// Register a company (admin-only)
export const registerCompany = async (companyData) => {
    console.log("Register Company Data:", companyData); // Debug the data
    return await API.post("/companies/register", companyData);
}

// Get all companies
export const getAllCompanies = () => API.get("/companies");

// Get a company by ID (admin or teamPool)
export const getCompanyById = (companyId) => API.get(`/companies/${companyId}`);

// Update a company (admin-only)
export const updateCompany = (companyId, companyData) =>
    API.patch(`/companies/${companyId}`, companyData);

// Activate a company (admin-only)
export const activateCompany = (companyId) =>
    API.patch(`/companies/${companyId}/activate`);

// Deactivate a company (admin-only)
export const deactivateCompany = (companyId) =>
    API.patch(`/companies/${companyId}/deactivate`);
