const { TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const { client } = require("../config/client");
const { hederatopicId } = require("../config/env");
const RecognitionNote = require("../models/recognitionModel");

exports.submitRecognitionNote = async (staffId, message) => {
  if (!hederatopicId) {
    throw new Error("Hedera topic ID not set in environment variables");
  }

  const note = {
    staffId,
    message,
    timestamp: new Date().toISOString(),
  };

  const transaction = new TopicMessageSubmitTransaction({
    topicId: hederatopicId,
    message: JSON.stringify(note),
  });

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save note to MongoDB
    const recognitionNote = new RecognitionNote({ staffId, message });
    await recognitionNote.save();
  }

  return receipt.status.toString();
};
