const mongoose = require("mongoose");

const recognitionNoteSchema = new mongoose.Schema({
    staffId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RecognitionNote", recognitionNoteSchema);
