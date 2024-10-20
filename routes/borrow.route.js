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

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrowed:
 *       type: object
 *       required:
 *         - book
 *         - user_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         book:
 *           type: string
 *           description: The borrowed book id
 *         user_id:
 *           type: string
 *           description: The user id
 *       example:
 *         id: d5fE_asz
 *         book: 112335
 *         user_id: 4566556
 */

/**
  * @swagger
  * tags:
  *   name: Borrowed
  *   description: The boorrowed books managing API
  */


/**
 * @swagger
 * /api/borrow:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Borrow a book
 *     tags: [Borrowed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Borrowed'
 *     responses:
 *       200:
 *         description: The book was successfully borrowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrowed'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Some server error
 */
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
        const popular = await Popular.find({"book": bookId});
        if (!popular)
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

/**
 * @swagger
 * /api/borrow/history:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the borrowed books history of the user
 *     tags: [Borrowed]
 *     responses:
 *       200:
 *         description: The book description by title
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrowed'
 *       500:
 *         description: error in fetching
 */
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