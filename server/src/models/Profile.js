const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: ""
  },
  lastName: {
    type: String,
    trim: true,
    default: ""
  },
  photo: {
    type: String,
    trim: true,
    default: ""
  },
  files: {
    type: String,
    trim: true,
    default: ""
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User"
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

module.exports = mongoose.model("Profile", Profile);