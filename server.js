require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Zophion Backend Running 🚀");
});

// ✅ Send Email API
app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {

    // 🔥 FIXED SMTP CONFIG (Important)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Optional: verify connection
    await transporter.verify();

    await transporter.sendMail({
      from: `"Zophion Website" <${process.env.EMAIL_USER}>`,
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
