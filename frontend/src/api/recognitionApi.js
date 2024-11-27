import API from "./axiosConfig";

// Add a recognition note
export const submitRecognitionNote = async ({ recipientId, guestId, message }) => {
  try {
    const response = await API.post("/recognition/add", {
      recipientId: recipientId,
      guestId: guestId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting recognition note:",
      error.response?.data || error.message
    );
    throw error;
  }
};
