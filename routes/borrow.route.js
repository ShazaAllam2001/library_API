const express = require('express');

const router = express.Router();
const authorize = require('../middleware/authMiddleware.js');
const { borrowBook, bookHistory } = require('../handlers/borrow.js');

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
router.post('/', authorize(['user', 'admin']), borrowBook);

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
router.get('/history', authorize(['user', 'admin']), bookHistory);

module.exports = router;