const mongoose = require("mongoose");

const PageThreads = new mongoose.Schema({
    pageID: {
        type: mongoose.Schema.ObjectId,
        ref: "PageList",
        required: true
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "Profile",
        required: true
    },
    scheduleID: {
        type: mongoose.Schema.ObjectId,
        ref: "PageSchedule"
    },
    description: {
        type: String,
        required: true
    },
    files: {
        type: String,
        default: ""
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: ""
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("PageThreads", PageThreads);