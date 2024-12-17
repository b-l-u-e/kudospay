const axios = require("axios");

// Hedera Mirror Node API Base URL (use testnet or mainnet)
const HEDERA_API_BASE_URL = "https://testnet.mirrornode.hedera.com/api/v1";

exports.getAccountDetails = async (accountId) => {
  try {
    const response = await axios.get(`${HEDERA_API_BASE_URL}/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error.message);
    throw new Error("Failed to fetch account details.");
  }
};

exports.getTopicMessages = async (topicId) => {
  try {
    const response = await axios.get(`${HEDERA_API_BASE_URL}/topics/${topicId}/messages`)
    return response.data;
  } catch (error) {
    console.error("Error fetching topic messages:", error);
    throw new Error("Failed to fetch messages from Hedera topic.");
  }
}
