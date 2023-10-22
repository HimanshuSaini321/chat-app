const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const app = express();

// Body parser middleware for parsing POST request data
app.use(bodyParser.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cyrus30@ethereal.email',
        pass: 'cb7j7u4AFXe53zj32K'
    }
});


// Login route with a simplified login condition check
app.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    // Perform your authentication logic here, for example, checking if the credentials are valid.
    if (email === user.email && password === user.password) {
        // Authentication successful, send a login successful email
        const mailOptions = {
            from: '<bhajwalyabdn@gmail.com>',
            to: 'himanshu123bhajwalya@gmail.com', // Change this to the recipient's email address
            subject: 'Login Successful',
            text: 'Hello, your login was successful!',
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending login email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Login successful');
            }
        });
    } else {
        // Authentication failed
        res.status(401).send('Login failed. Check your credentials.');
    }
}
));
