const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         password:
 *           type: string
 *           description: The user password
 *         email:
 *           type: string
 *           description: The user email
 *         role:
 *           type: string
 *           description: The user role (user, admin)
 *       example:
 *         id: d5fE_asz
 *         username: Shaza
 *         password: 123
 *         email: shaza@xyz.com
 *         role: admin
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register user to the database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user info
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: error in registration
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch(error) {
        res.status(500).json({error: 'Registration failed'});
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in user to the website
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user token
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: error in log in
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;