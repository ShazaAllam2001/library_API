const Borrow = require('../models/borrowed.model.js');
const Popular = require('../models/popular.model.js');

const currentBorrowed = async (req, res) => {
    try {
        const borrow = await Borrow.find({});
        res.status(200).json(borrow);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

const popularBooks = async (req, res) => {
    try {
        const popular = await Popular.find({}).select('book');
        res.status(200).json(popular);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { currentBorrowed, popularBooks }