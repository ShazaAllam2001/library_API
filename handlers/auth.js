const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

const register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        if (!username || !password || !email || !role)
            return res.status(400).json({ error: 'Fields missing' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch(error) {
        res.status(500).json({error: 'Registration failed'});
    }
}

const login = async (req, res) => {
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
}

module.exports = { register, login };