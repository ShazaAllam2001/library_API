const express = require('express');

const router = express.Router();
const Borrow = require('../models/borrowed.model.js');
const Popular = require('../models/popular.model.js');
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
router.get('/borrowed', authorize(['admin']), async (req, res) => {
    try {
        const borrow = await Borrow.find({});
        res.status(200).json(borrow);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

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
router.get('/popular', authorize(['admin']), async (req, res) => {
    try {
        const popular = await Popular.find({}).select('book');
        res.status(200).json(popular);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;