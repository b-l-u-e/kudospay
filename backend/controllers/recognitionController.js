const recognitionService = require("../services/recognitionService");

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

// Controller to fetch recognition notes for a staff member
exports.getRecognitionNotes = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!recipientId) {
      return res.status(400).json({ error: "Staff ID is required." });
    }

    // Call the service to fetch recognition notes
    const result = await recognitionService.getRecognitionNotes(
      recipientId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching recognition notes:", error.message);
    res.status(500).json({ error: error.message });
  }
};
