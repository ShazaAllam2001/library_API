const mongoose = require('mongoose');

const BorrowedSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book',
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, 
    {
        timestamps: true
    }
);

const Borrowed = mongoose.model("Borrowed", BorrowedSchema);
module.exports = Borrowed;