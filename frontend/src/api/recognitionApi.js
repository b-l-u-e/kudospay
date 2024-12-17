import API from "./axiosConfig";

// Add a recognition note
export const addRecognitionNote = async ({ recipientId, guestId, message }) => {
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

// Fetch all messages for a given topic
export const fetchRecognitionMessages = async () => {
  try {
    const response = await API.get(`/recognition/messages`);
    return response.data.messages; // Extract the messages from the response
  } catch (error) {
    console.error("Error fetching recognition messages:", error.message);
    throw error;
  }
};

// Fetch messages for a specific recipient within a topic
export const fetchRecognitionMessagesByRecipient = async (recipientId) => {
  try {
    const response = await API.get(
      `/recognition/messages/${recipientId}`
    );
    return response.data.messages; // Extract the messages from the response
  } catch (error) {
    console.error("Error fetching recognition messages by recipient:", error.message);
    throw error;
  }
};
