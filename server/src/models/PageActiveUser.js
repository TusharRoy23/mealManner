const mongoose = require("mongoose");

const PageActiveUserList = new mongoose.Schema({
    pageID: [{
        type: mongoose.Schema.ObjectId,
        ref: "PageList",
        required: true
    }],
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    deactivationDate: {
        type: String,
        default: ""
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("PageActiveUserList", PageActiveUserList);