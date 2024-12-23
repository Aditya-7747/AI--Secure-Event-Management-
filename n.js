const express = require('express');
const stripe = require('stripe')('your-secret-key-here');  // Secret key from Stripe
const twilio = require('twilio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Twilio setup
const client = twilio('your-account-sid', 'your-auth-token');

// Payment route
app.post('/process-payment', async (req, res) => {
    const { token } = req.body;
    try {
        const charge = await stripe.charges.create({
            amount: 5000, // Amount in cents (e.g., $50.00)
            currency: 'usd',
            source: token,
            description: 'Event Payment',
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
});

// SMS route
app.post('/send-sms', (req, res) => {
    const { phoneNumber, eventName } = req.body;
    client.messages.create({
        body: `Your event "${eventName}" has been successfully added.`,
        from: '+1your-twilio-phone-number',
        to: phoneNumber,
    })
    .then((message) => {
        res.json({ success: true });
    })
    .catch((error) => {
        console.error(error);
        res.json({ success: false, error: error.message });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
