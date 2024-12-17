import API from "./axiosConfig";

// Register a company (admin-only)
export const registerCompany = async (companyData) => {
  console.log("Register Company Data:", companyData); // Debug the data
  return await API.post("/companies/register", companyData);
};

export const getActiveStaffCount = async (companyId) => {
  try {
    const response = await API.get(
      `/companies/${companyId}/active-staff/count`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active staff count:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getActiveStaff = async (companyId) => {
  try {
    const response = await API.get(`/companies/${companyId}/active-staff`);
    return response.data; // Returns the active staff list
  } catch (error) {
    console.error(
      "Error fetching active staff:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all companies
export const getAllCompanies = async () => {
  try {
    const response = await API.get("/companies");
    
    console.log("getAllCompanies response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching companies:",
      error.response?.data || error.message
    );
    throw error;
  }
};

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

export const getCompanyBalance = async (companyId) => {
  try {
    const response = await API.get(`/companies/${companyId}/balance`);
    return response.data.balance;
  } catch (error) {
    console.error("Error fetching company balance:", error);
    throw error;
  }
};

export const getCompanyStaff = async (companyId) => {
  try {
    const response = await API.get(`/companies/${companyId}/staff`);
    return response.data.staff;
  } catch (error) {
    console.error("Error fetching company staff:", error);
    throw error;
  }
};

export const distributeTips = async (hederaAccountId, amount) => {
  try {
    const response = await API.post(`/companies/${hederaAccountId}/distribute`, {
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Error distributing tips:", error.response?.data || error.message);
    throw error;
  }
};

export const getCompanyTransactions = async (companyId) => {
  try {
    const response = await API.get(`/companies/${companyId}/transactions`);
    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching company transactions:", error);
    throw error;
  }
};


export const addStaff = async (companyId, staffData) => {
  try {
    const response = await API.post(`/companies/${companyId}/staff`, staffData);
    return response.data;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const updateStaff = async (companyId, staffData) => {
  try {
    const response = await API.patch(
      `/companies/${companyId}/staff`,
      staffData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const deleteStaff = async (companyId, staffData) => {
    try {
      const response = await API.delete(`/companies/${companyId}/staff`, staffData);
      return response.data;
    } catch (error) {
      console.error("Error adding staff:", error);
      throw error;
    }
  };
  
