const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const stripe = require("stripe")("your_stripe_secret_key");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/crowdfundingDB", { useNewUrlParser: true, useUnifiedTopology: true });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: Number,
  currentFunding: { type: Number, default: 0 },
});

const Project = mongoose.model("Project", projectSchema);

app.post("/create-project", async (req, res) => {
  const { title, description, goal } = req.body;
  const project = new Project({ title, description, goal });
  await project.save();
  res.redirect("/");
});

app.post("/contribute", async (req, res) => {
  const { projectId, amount } = req.body;
  try {
    // Handle Stripe payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert dollars to cents
      currency: "usd",
    });

    // Update project funding in MongoDB
    const project = await Project.findById(projectId);
    project.currentFunding += amount;
    await project.save();

    res.send({ success: true, client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
