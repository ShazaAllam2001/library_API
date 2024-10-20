const Return = require('../models/returned.model.js');
const Borrow = require('../models/borrowed.model.js');

const returnBook = async (req, res) => {
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
};

module.exports = { returnBook }