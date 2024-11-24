import API from "./axiosConfig";

// Register a staff member (admin or teamPool)
export const registerStaff = async (staffData) => {
    console.log("Register Staff Data:", staffData); // Debug the data
    return await API.post("/staff/register", staffData);
}

export const getAllStaff = () => API.get("/staff")


// Get staff members by company ID (admin or teamPool)
export const getStaffByCompany = (companyId) =>
    API.get(`/staff/company/${companyId}`);

// Update staff details (admin or teamPool)
export const updateStaff = (staffId, staffData) =>
    API.patch(`/staff/${staffId}`, staffData);

// Delete a staff member (admin or teamPool)
export const deleteStaff = (staffId) => API.delete(`/staff/${staffId}`);

// Activate a staff member (admin or teamPool)
export const activateStaff = (staffId) => API.patch(`/staff/${staffId}/activate`);

// Deactivate a staff member (admin or teamPool)
export const deactivateStaff = (staffId) =>
    API.patch(`/staff/${staffId}/deactivate`);
