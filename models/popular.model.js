const mongoose = require('mongoose');

const PopularSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book',
        required: true
    }
}, 
    {
        timestamps: true
    }
);

const Popular = mongoose.model("Popular", PopularSchema);
module.exports = Popular;