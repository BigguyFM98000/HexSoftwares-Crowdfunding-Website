const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_26PHem9AhJZvU623DfE1x4sd");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://crowdfunding:password12345@webmobileapplication.jx4opz3.mongodb.net/crowdfundingDB?retryWrites=true&w=majority&appName=WebMobileApplication', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB instance');
}).catch((err) => {
  console.log(err.message);
});

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
      currency: "zar",
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
