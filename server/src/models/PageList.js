const mongoose = require("mongoose");

const PageList = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Profile"
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    deactivationDate: {
        type: Date,
        default: ""
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("PageList", PageList);