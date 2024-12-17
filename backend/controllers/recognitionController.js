const recognitionService = require("../services/recognitionService");
const mirrorNodeService = require("../services/mirrorNodeService");
const { hederaTopicId } = require("../config/env");

// Controller to add a recognition note
exports.addRecognitionNote = async (req, res) => {
  try {
    const { recipientId, guestId, message } = req.body;

    // Validate input fields
    if (!recipientId || !guestId || !message) {
      return res
        .status(400)
        .json({ error: "Staff ID, Guest ID, and message are required." });
    }

    // Call the service to submit the recognition note
    const result = await recognitionService.submitRecognitionNote({
      recipientId,
      guestId,
      message,
    });

    res.status(201).json({
      message: "Recognition note added successfully",
      status: result,
    });
  } catch (error) {
    console.error("Error adding recognition note:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecognitionMessages = async (req, res) => {
  try {
    // Fetch messages using the service
    const topicData = await mirrorNodeService.getTopicMessages(hederaTopicId);

    // Decode Base64 messages
    const messages = (topicData.messages || []).map((msg) => ({
      timestamp: msg.consensus_timestamp,
      message: Buffer.from(msg.message, "base64").toString("utf-8"), // Decode Base64
    }));

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching recognition messages:", error.message);
    res.status(500).json({ error: "Failed to fetch recognition messages." });
  }
};

exports.getRecognitionMessagesByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params; // Extract topic ID and recipient ID from route params

    if (!recipientId) {
      return res.status(400).json({ error: "Recipient ID is required." });
    }

    // Fetch all messages for the topic
    const topicData = await mirrorNodeService.getTopicMessages(hederaTopicId);

    // Decode Base64 messages and filter by recipientId
    const filteredMessages = (topicData.messages || [])
      .map((msg) => {
        const decodedMessage = JSON.parse(
          Buffer.from(msg.message, "base64").toString("utf-8")
        ); // Decode Base64
        return {
          ...decodedMessage,
          timestamp: msg.consensus_timestamp, // Add timestamp from Hedera
        };
      })
      .filter((msg) => msg.recipientId === recipientId); // Filter by recipientId

    res.status(200).json({ messages: filteredMessages });
  } catch (error) {
    console.error("Error fetching recognition messages:", error.message);
    res.status(500).json({ error: "Failed to fetch recognition messages." });
  }
};
