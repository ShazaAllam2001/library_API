const express = require('express');
const router = express.Router();

const  { register, login } = require('../handlers/auth.js');

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
router.post('/register', register);

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
router.post('/login', login);

module.exports = router;