const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        required: true,
        default: 'user' 
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;