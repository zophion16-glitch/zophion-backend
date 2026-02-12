require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ Allow CORS (important for cPanel frontend)
app.use(cors({
  origin: "*",   // You can restrict to your domain later
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Root route (to test backend in browser)
app.get("/", (req, res) => {
  res.send("Zophion Backend Running 🚀");
});

// ✅ Send Email API
app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "zophion16@gmail.com",
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.status(200).json({ message: "Email Sent Successfully" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email Failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
