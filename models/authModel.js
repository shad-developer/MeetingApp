const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });


// 🔹 Optional: Helper virtual or method to check if token is expired
userSchema.methods.isTokenValid = function() {
    return this.token?.expiresAt && this.token.expiresAt > new Date();
};


const User = mongoose.model('User', userSchema);
module.exports = User;
