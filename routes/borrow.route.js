const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();
const User = require('../models/user.model.js');
const Book = require('../models/book.model.js');
const Borrow = require('../models/borrowed.model.js');
const Popular = require('../models/popular.model.js');
const authorize = require('../middleware/authMiddleware.js');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', authorize(['user', 'admin']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json("Book does not exist");
        }
        console.log(book);
        
        const borrow = await Borrow.create({"book": bookId, "user_id": userId});
        await Popular.create({"book": bookId});

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Borrowed a Book',
            text: 'You borroweed the book with name ' + book.name
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) 
                return console.log('Error occurred: ' + error.message);
            
            console.log('Email sent: ' + info.response);
        });

        res.status(200).json(borrow);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/history', authorize(['user', 'admin']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const books = await Borrow.find({"user_id": userId});
        res.status(200).json(books);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;