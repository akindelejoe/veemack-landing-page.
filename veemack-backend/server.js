import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(" Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
// POST route for contact form
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "All fields required." });

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Email to VEEMACK
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `You received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Automatic thank-you email to visitor
    const clientMailOptions = {
      from: `"VEEMACK Technical Services" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for reaching out to VEEMACK!",
      text: `Hello ${name},\n\nThank you for contacting VEEMACK Technical Services. 
We’ve received your message and one of our engineers will reach out shortly.\n\nBest regards,\nThe VEEMACK Team`,
    };

    // Send both emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(clientMailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/", (req, res) => res.send("VEEMACK Backend Running"));
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
