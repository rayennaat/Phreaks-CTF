const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userFullName: { type: String, required: true },
  userTeamName: { type: String, required: true },
  challengeTitle: { type: String, required: true },
  type: { type: String, enum: ["Correct", "Incorrect"], required: true },
  providedFlag: { type: String, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ["Standard", "Linear", "Logarithmic"], required: true }, // New field
  points: { type: Number, default: 0 }, // New field for points
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
