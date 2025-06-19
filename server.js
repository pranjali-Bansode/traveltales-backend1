const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB Models
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the TravelTales Backend!');
});

const nodemailer = require('nodemailer');

// Contact form handler
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log("Incoming contact form:", req.body);

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting TravelTales!',
            text: `Hi ${name},\n\nThank you for reaching out to us. We'll get back to you shortly!\n\nBest,\nTeam TravelTales`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Confirmation email sent");

        res.status(201).json({ message: 'Contact message saved and email sent!' });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: 'Failed to save contact or send email' });
    }
});

// Booking form handler
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: `Your TravelTales Booking for ${req.body.destination}`,
            html: `
                <h2>Hello ${req.body.name},</h2>
                <p>Thank you for booking with <strong>TravelTales</strong>!</p>
                <p>Here are your trip details:</p>
                <ul>
                    <li><strong>Destination:</strong> ${req.body.destination}</li>
                    <li><strong>Date:</strong> ${req.body.travelDate}</li>
                    <li><strong>People:</strong> ${req.body.numPeople}</li>
                    <li><strong>Days:</strong> ${req.body.numDays}</li>
                    <li><strong>Trip Type:</strong> ${req.body.tripType}</li>
                    <li><strong>Stay Type:</strong> ${req.body.stayType}</li>
                    <li><strong>Meal Plan:</strong> ${req.body.mealType}</li>
                    <li><strong>Total Cost:</strong> ₹${req.body.totalCost}</li>
                </ul>
                <p>We look forward to making your trip memorable! 🌍</p>
                <p>— Team TravelTales</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Booking confirmation email sent");

        res.status(201).json({ message: 'Booking saved and email sent!' });
    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({ error: 'Failed to save booking or send email' });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
