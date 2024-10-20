const express = require('express');

const router = express.Router();
const Return = require('../models/returned.model.js');
const Borrow = require('../models/borrowed.model.js');
const authorize = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Returned:
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
 *           description: The returned book id
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
  *   name: Returned
  *   description: The boorrowed books managing API
  */

/**
 * @swagger
 * /api/return:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Return a book
 *     tags: [Returned]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Returned'
 *     responses:
 *       200:
 *         description: The book was successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Returned'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Some server error
 */
router.post('/', authorize(['user', 'admin']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId } = req.body;
        const borrow = await Borrow.findAndDelete({"book": bookId});
        if (!borrow) {
            return res.status(404).json("Book is not borrowed");
        }
        console.log(userId, borrow);
        
        const returned = await Return.create({"book": bookId, "user_id": userId});
        res.status(200).json(returned);

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;