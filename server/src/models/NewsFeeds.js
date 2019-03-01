const mongoose = require('mongoose');

const NewsFeeds = new mongoose.Schema({
    description: {
        type: String,
        default: ""
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
    threadID: {
        type: mongoose.Schema.ObjectId,
        ref: "PageThreads"
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "Profile",
        required: true
    },
    pageID: {
        type: mongoose.Schema.ObjectId,
        ref: "PageList"
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("NewsFeeds", NewsFeeds);