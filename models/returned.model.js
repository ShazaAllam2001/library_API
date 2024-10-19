const mongoose = require('mongoose');

const ReturnedSchema = mongoose.Schema({
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

const Returned = mongoose.model("Returned", ReturnedSchema);
module.exports = Returned;