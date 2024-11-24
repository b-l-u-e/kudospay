const recognitionService = require("../services/recognitionService");

// Controller to add a recognition note
exports.addRecognitionNote = async (req, res) => {
  const { staffId, message } = req.body; // Retrieve the staff ID and message from the request

  try {
    // Call the service to submit the recognition note
    const result = await recognitionService.submitRecognitionNote(
      staffId,
      message
    );
    res
      .status(200)
      .json({ message: "Recognition note added successfully", status: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
