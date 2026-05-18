const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "please Enter Name"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "please Enter Email"]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,       // allows multiple docs to have no phone (OAuth users)
        required: false
    },
    password: {
        type: String,
        required: false     // OAuth users won't have a password
    },
    avatar: {
        type: String,
        default: ""
    },
    provider: {
        type: String,
        enum: ["local", "github", "google"],
        default: "local"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);