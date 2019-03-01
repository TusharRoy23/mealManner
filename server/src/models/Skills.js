const mongoose = require("mongoose");

const Skill = new mongoose.Schema({
    skillName: {
        type: String,
        trim: true,
        required: true
    },
    skillDescription: {
        type: String,
        trim: true,
        default: ""
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("Skill", Skill);