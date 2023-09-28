const { json } = require("express");
const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    friends: {
        type: Array,
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("User", userschema);