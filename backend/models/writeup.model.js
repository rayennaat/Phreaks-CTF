const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const writeupSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // ✅ Store user IDs properly
  pending: { type: Boolean, default: true }, // ✅ New field (waiting for admin approval)
});

module.exports = mongoose.model("Writeup", writeupSchema);
