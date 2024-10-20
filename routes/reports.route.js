const express = require('express');

const router = express.Router();
const { currentBorrowed, popularBooks } = require('../handlers/report.js');
const authorize = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * /api/reports/borrowed:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the currently borrowed books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the obrrowed books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: error in fetching
 */
router.get('/borrowed', authorize(['admin']), currentBorrowed);

/**
 * @swagger
 * /api/reports/popular:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the popular books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the popular books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: error in fetching
 */
router.get('/popular', authorize(['admin']), popularBooks);

module.exports = router;