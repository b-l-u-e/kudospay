import API from "./axiosConfig";

// Register guest
export const registerGuest = async (guestData) => {
  console.log("Register Guest Data:", guestData); // Debug the data
  return await API.post("/guests/register", guestData);
};


// Fetch a guest by ID (admin-only)
export const getGuest = (guestId) => API.get(`/guests/${guestId}`);

// Get a guest by ID
export const getGuestById = (guestId) => API.get(`/guests/${guestId}`);

// Update a guest by ID (admin-only)
export const updateGuest = (guestId, guestData) =>
  API.patch(`/guests/${guestId}`, guestData);

// Delete a guest by ID (admin-only)
export const deleteGuest = (guestId) => API.delete(`/guests/${guestId}`);
