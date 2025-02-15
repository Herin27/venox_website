const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

ADMIN_EMAIL="herin7151@gmail.com";
ADMIN_PASS="saqs bgro qtgk wlxh";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', './deshboard.html'));
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to send email
app.post('/send-mail', async (req, res) => {
    const { name, email, phone, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "herin7151@gmail.com", // Your email
            pass: "saqs bgro qtgk wlxh"   // Your email password
        }
    });

    let mailOptions = {
        from: email,
        to: "herin7151@gmail.com", // Admin's email
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email!" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
