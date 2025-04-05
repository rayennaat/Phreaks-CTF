const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    ip: { type: String, required: true }, // Stores IP as a string (IPv4 or IPv6 format)
    fullName: { type: String, required: true }, // User's full name, trimmed
    email: { type: String, required: true }, // Unique and lowercase email
    rawEmail: { type: String, required: true }, // Raw email for display
    password: { type: String, required: true }, // Hashed password
    profilePic: { type: String, default: 'uploads/teamprofile.png' }, // Optional, stores URL or path to the image
    teamId: { type: String, default: null }, // Reference to the Team model
    points: { type: Number, default: 0 }, // Default points for new users
    createdOn: { type: Date, default: new Date().getTime()}, // Automatically set creation date
    isBanned: { type: Boolean, default: false },  // If true, the user is banned
    isHidden: { type: Boolean, default: false },  // If true, the user is hidden
    banReason: { type: String, default: null },   // Optional reason for banning
    isAdmin: { type: Boolean, default: false }, // If true, the user is an admin
    country: { type: String, default: '' },
    link: { type: String, default: '' }
});

module.exports = mongoose.model("User", userSchema);

/*

const userSchema = new Schema({
    fullName : { type: String},
    email : { type: String},
    password : { type: String},
    created0n : { type: Date, default: new Date().getTime()},
});

module.exports = mongoose.model("User", userSchema);

*/ 