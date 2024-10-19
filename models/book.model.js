const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"]
    },
    author: {
        type: String,
        required: [true, "Please enter book author"]
    },
    details: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;