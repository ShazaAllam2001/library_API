const express = require('express');

const router = express.Router();
const authorize = require('../middleware/authMiddleware.js');
const { getBooks, getBook, createBook, editBook, deleteBook } = require('../handlers/book.js');

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
 *       500:
 *         description: error in fetching
 */
router.get('/', authorize(['user', 'admin']), getBooks);

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
 *       500:
 *         description: error in fetching
 */
router.get('/:id', authorize(['user', 'admin']), getBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post('/', authorize(['admin']), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 * 
 *     responses:
 *       200:
 *         description: The book was deleted
 *       500:
 *         description: some server error
 */
router.put('/:id', authorize(['admin']), editBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 * 
 *     responses:
 *       200:
 *         description: The book was deleted
 *       500:
 *         description: some server error
 */
router.delete('/:id', authorize(['admin']), deleteBook);

module.exports = router;