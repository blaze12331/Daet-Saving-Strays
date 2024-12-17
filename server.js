const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Email route

app.post("/send-email", async (req, res) => {
  const { adopterEmail, petName, emailType } = req.body;

  // Configure the email transporter (replace with your SMTP provider details)
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., "gmail", "hotmail", or replace with SMTP settings
    auth: {
      user: "lrdrndn51103@gmail.com",
      pass: "xd", 
    },
  });

  // Set email subject and message body
  let subject, text;
  if (emailType === "approved") {
    subject = "Adoption Request Approved";
    text = `Congratulations! Your application to adopt ${petName} has been approved. Please contact us for further steps.`;
  } else if (emailType === "declined") {
    subject = "Adoption Request Declined";
    text = `We're sorry, but your application to adopt ${petName} has been declined.`;
  }

  try {
    // Send the email
    await transporter.sendMail({
      from: "orendainlord51103@gmail.com",
      to: adopterEmail,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully.");
    res.status(200).send({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ success: false, message: "Failed to send email" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
