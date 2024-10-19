const express = require('express');

const router = express.Router();
const Book = require('../models/book.model.js');
const authorize = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - author
 *         - details
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *         details:
 *           type: string
 *           description: The book details
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         details: nice book
 */

/**
  * @swagger
  * tags:
  *   name: Books
  *   description: The books managing API
  */
 
/**
 * @swagger
 * /api/books:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', authorize(['user', 'admin']), async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get('/:id', authorize(['user', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        res.status(200).json(book);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

/**
 * @swagger
 * /api/books/{title}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get('/:title', authorize(['user', 'admin']), async (req, res) => {
    try {
        const { title } = req.params;
        const books = await Book.find(item => item.title.toLowerCase() === title.toLowerCase());
        res.status(200).json(books);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(200).json(book);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body);
        if (!book) {
            return res.status(404).json({message: "Book not found"});
        }
        const updatedBook = await Book.findById(id);
        res.status(200).json(updatedBook);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id, req.body);
        if (!book) {
            return res.status(500).json({message: "Book not found"});
        }
        res.status(200).json({message: "Book deleted Sucessfully"});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;