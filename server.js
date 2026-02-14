require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

/* ✅ Simple & safe CORS */
app.use(cors({
  origin: "https://zophion-frontend.netlify.app",
}));

app.use(express.json());

/* Root test */
app.get("/", (req, res) => {
  res.send("Zophion Backend Running 🚀");
});

/* Send email route */
app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Zophion Enquiry" <${process.env.EMAIL_USER}>`,
      to: "zophion16@gmail.com",
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
