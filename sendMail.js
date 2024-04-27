const nodemailer = require("nodemailer");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();

app.use(bodyParser.json());

// Allow requests from your website's origin
app.use(cors({ origin: 'https://bhargavvjois.github.io/Portfolio/' }));

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

async function sendEmail(name, email, message) {
  try {

    // Validate user-provided data for security.
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, or message!");
    }
    if (!emailRegex.test(email)){
        throw new Error("Invalid Email!");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smpt.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: {
        name: name,
        address: process.env.EMAIL,
      },
      to: "hellobhargavv@gmail.com",
      subject: "Message from Contact Form",
      text: `${message}
            Email: ${email}`,
      html: `<b>${message}</b><br/><b>Email: ${email}</b>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendEmail(name, email, message);
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
