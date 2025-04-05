const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pointsMethod: { type: String, enum: ["Standard", "Linear", "Logarithmic"], default: "Standard" },
  points: { type: Number, default: 0 },
  initialValue: { type: Number, default: 0 },
  decayValue: { type: Number, default: 0 },
  minimumValue: { type: Number, default: 0 },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  hint: { type: String, default: "" },
  resource: {
    type: String,
    default: "",
    validate: {
      validator: function (value) {
        if (!value) return true;
        return /\.(rar|zip)$/i.test(value);
      },
      message: "Resource file must be in .rar or .zip format.",
    },
  },
  solvedByTeams: [
    {
      team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      time: { type: Date, default: Date.now },
      points: { type: Number, required: true } // NEW FIELD
    },
  ],
  solvedByUsers: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Date, default: Date.now },
      points: { type: Number, required: true } // NEW FIELD
    },
  ],
  flag: { type: String, required: true },
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
