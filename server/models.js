const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: Number,
  currentFunding: { type: Number, default: 0 },
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contribution" }],
});

const contributionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  amount: Number,
  contributorName: String,
  date: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = { Project, Contribution };
