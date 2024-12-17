import API from "./axiosConfig";

// Register a staff member (admin or teamPool)
export const registerStaff = async (staffData) => {
    console.log("Register Staff Data:", staffData); // Debug the data
    return await API.post("/staff/register", staffData);
}

// Fetch staff details by ID
export const getStaffDetails = async (staffId) => {
    console.log("Fetching details for staff ID:", staffId);
    try {
      const response = await API.get(`/staff/${staffId}/details`);
      console.log("API Response for Staff Details:", response.data);
      return response.data.staff; // Extract the staff details from the response
    } catch (error) {
      console.error("Error fetching staff details:", error.response?.data || error.message);
      throw error;
    }
  };

export const getAllStaff = async () => {
  try {
    const response = await API.get("/staff");
    console.log("getAllStaff response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching staff:",
      error.response?.data || error.message
    );
    throw error;
  }
} 



// Get staff members by company ID (admin or teamPool)
export const getStaffByCompany = async(companyId) =>{
    console.log("retrieving Staff Data:", companyId); 
   return await API.get(`/staff/company/${companyId}`);
}

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
