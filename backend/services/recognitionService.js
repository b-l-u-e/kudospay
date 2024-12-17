const { TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const { client } = require("../config/client");
const RecognitionNote = require("../models/recognitionModel");
const { hederaTopicId } = require("../config/env");

exports.submitRecognitionNote = async ({recipientId, guestId, message}) => {
  if (!hederaTopicId) {
    throw new Error("Hedera topic ID not set in environment variables");
  }

  if (!recipientId || !guestId || !message) {
    throw new Error("recipient ID, Guest ID, and message are required.");
  }

  const note = {
    recipientId,
    guestId,
    message,
    timestamp: new Date().toISOString(),
  };

  const transaction = new TopicMessageSubmitTransaction({
    topicId: hederaTopicId,
    message: JSON.stringify(note),
  });

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save note to MongoDB
    const recognitionNote = new RecognitionNote({ recipientId, guestId, message });
    await recognitionNote.save();
  }

  return receipt.status.toString();
};


