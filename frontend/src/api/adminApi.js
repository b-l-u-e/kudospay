import API from "./axiosConfig";

/**
 * Self-register an admin (public route for first-time admin registration)
 * @param {Object} adminData - Admin registration data (username, email, password)
 * @returns {Promise} Axios response with admin data and token
 */
export const selfRegisterAdmin = (adminData) => API.post("/admin/self-register", adminData);

/**
 * Fetch all users (admin-only)
 * @returns {Promise} Axios response with a list of all users
 */
export const getAllUsers = () => API.get("/admin/users");

/**
 * Fetch a specific user by ID (admin-only)
 * @param {string} userId - User ID to fetch
 * @returns {Promise} Axios response with user data
 */
export const getUserById = (userId) => API.get(`/admin/users/${userId}`);

/**
 * Create a new user with a specific role (admin-only)
 * @param {Object} userData - New user data (username, email, role, etc.)
 * @returns {Promise} Axios response with created user details
 */
export const createUser = (userData) => API.post("/admin/users", userData);

/**
 * Update a user's role (admin-only)
 * @param {string} userId - ID of the user to update
 * @param {string} newRole - New role to assign to the user
 * @returns {Promise} Axios response with updated user details
 */
export const updateUserRole = (userId, newRole) => API.put(`/admin/users/${userId}/role`, { role: newRole });

/**
 * Delete a user (admin-only)
 * @param {string} userId - ID of the user to delete
 * @returns {Promise} Axios response confirming the deletion
 */
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);

/**
 * Generate a registration link for a specific role (admin-only)
 * @param {string} role - Role for the registration link (e.g., "staff", "teamPool")
 * @returns {Promise} Axios response with the registration link
 */
export const generateRegistrationLink = (role) =>
    API.post("/admin/generate-registration-link", { role });

/**
 * Get staff members by company ID (admin-only)
 * @param {string} companyId - Company ID to fetch staff members for
 * @returns {Promise} Axios response with a list of staff members
 */
export const getStaffByCompany = (companyId) => API.get(`/admin/company/${companyId}/staff`);
