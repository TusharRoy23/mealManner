const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 1
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  deactivationDate: {
    type: Date,
    default: ""
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({
    $or: [{
      username: username
    }, {
      email: username
    }]
  }, function (
    err,
    user
  ) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user._id);
      } else {
        return callback();
      }
    });
  });
};

UserSchema.statics.userInfo = function (userID, callback) {
  User.findById(userID, (error, user) => {
    if (error) {
      return callback(null, error);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(null, err);
    } else {
      return callback(null, user);
    }
  });
  //return 'user';
};

//hashing a password before saving it to the database
UserSchema.pre("save", function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

var User = mongoose.model("User", UserSchema);
module.exports = User;