require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("@getbrevo/brevo");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Zophion Backend Running 🚀");
});

// Send Email Route
app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {
    // Setup Brevo API
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // Email Data
    const sendSmtpEmail = {
      sender: {
        email: "zophion16@gmail.com",   // MUST be verified in Brevo
        name: "Zophion"
      },
      to: [
        {
          email: "zophion16@gmail.com"
        }
      ],
      subject: "New Enquiry Received",
      htmlContent: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email Sent Successfully:", result);

    res.status(200).json({
      message: "Email Sent Successfully"
    });

  } catch (error) {
    console.error(
      "FULL BREVO ERROR:",
      error.response?.body || error.message || error
    );

    res.status(500).json({
      message: "Email Failed",
      error: error.response?.body || error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
