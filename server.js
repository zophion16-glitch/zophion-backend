require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();








app.use(cors());
app.use(express.json());

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.use((req, res, next) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  } else {
    next();
  }
});

}

// Send enquiry email
app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // your Gmail
        pass: process.env.EMAIL_PASS,       // App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "zophion16@gmail.com", // where enquiries will be sent
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", info.response);

    res.status(200).json({ message: "Email Sent Successfully" });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({ message: "Email Failed" });
  }
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
