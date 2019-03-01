const mongoose = require("mongoose");

const PageUserList = new mongoose.Schema({
    pageID: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "PageList"
    },
    adminUser: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Profile"
    },
    members: {
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
    activePageUser: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("PageUserList", PageUserList);