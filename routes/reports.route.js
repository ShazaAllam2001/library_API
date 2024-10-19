const express = require('express');

const router = express.Router();
const Borrow = require('../models/borrowed.model.js');
const Popular = require('../models/popular.model.js');
const authorize = require('../middleware/authMiddleware.js');

router.get('/borrowed', authorize(['admin']), async (req, res) => {
    try {
        const borrow = await Borrow.find({}).select('book');
        res.status(200).json(borrow);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/popular', authorize(['admin']), async (req, res) => {
    try {
        const popular = await Popular.find({}).select('book');
        res.status(200).json(popular);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;