require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("@getbrevo/brevo");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Zophion Backend Running 🚀");
});

app.post("/send-email", async (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = {
      sender: { email: "zophion16@gmail.com", name: "Zophion" },
      to: [{ email: "zophion16@gmail.com" }],
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

    await apiInstance.sendTransacEmail(sendSmtpEmail);

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
