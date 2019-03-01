const express = require('express')
const router = express.Router()
const Users = require("../models/User");
const Profile = require("../models/Profile");
const config = require("../Config");
const jwt = require('jsonwebtoken');
const verifyToken = require("../VerifyToken");

router.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    req.checkBody("username", "User Name is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();

    var errors = req.validationErrors(true);

    if (errors) {
        res.send({
            success: "Error"
        });
    } else {
        Users.authenticate(username, password, (error, user) => {
            if (error || !user) {
                res.send({
                    success: "Error"
                });
            } else {
                // console.log("login user ID: " + user);
                //req.session.userID = user;
                // var token = jwt.sign({
                //     id: user._id
                // }, config.SECRET_KEY, {
                //     expiresIn: 86400 // expires in 24 hours
                // });

                // console.log("token: " + token);

                res.send({
                    user: user,
                    //token: token,
                    success: "Success"
                });
            }
        });
    }
});

router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    req.checkBody("username", "User Name is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("firstName", "First Name is required").notEmpty();
    req.checkBody("lastName", "Last Name is required").notEmpty();
    req.checkBody("email", "Valid E-mail is required").notEmpty().isEmail();

    var errors = req.validationErrors(true);

    if (errors) {
        res.send({
            success: false
        });
    } else {
        let user_arr = {
            username: username,
            password: password,
            email: email
        };

        Users.create(user_arr, (error, user) => {
            if (error) {
                res.send({
                    success: false
                });
            } else {
                let profile_arr = {
                    firstName: firstName,
                    lastName: lastName,
                    photo: "",
                    files: "",
                    userID: user._id
                };

                Profile.create(profile_arr, (error, profile) => {
                    if (error) {
                        res.send({
                            success: false
                        });
                    } else {
                        res.send({
                            profile: profile,
                            success: true
                        });
                    }
                });
            }
        });
    }
});

router.get("/getAuth", (req, res) => {
    //let userID = req.session.userID;
    //console.log("user ID: " + userID);
    let userID = "5c653df4f2f3ae69d7eef4ff";
    // if (userID) {
    //     const query = {
    //         userID: userID,
    //         //firstName: "Tushar",
    //         status: 1
    //     };
    //     Profile.findOne(query, (error, profile) => {
    //         if (error || !profile) {
    //             // console.log("user ID in auth: " + error);
    //             res.send({
    //                 success: false
    //             });
    //         } else {
    //             req.session.firstName = profile.firstName;
    //             //req.session.firstName = "Tushar";
    //             //console.log("user ID in auth: " + profile);
    //             res.send({
    //                 profile: profile,
    //                 success: true
    //             });
    //         }
    //     });
    // } else {
    //     res.send({
    //         success: false
    //     });
    // }
    if (userID) {
        const query = {
            userID: userID,
            //firstName: "Tushar",
            status: 1
        };
        Profile.findOne(query, (error, profile) => {
            if (error || !profile) {
                // console.log("user ID in auth: " + error);
                res.send({
                    success: false
                });
            } else {
                req.session.firstName = profile.firstName;
                //req.session.firstName = "Tushar";
                //console.log("user ID in auth: " + profile);
                res.send({
                    profile: profile,
                    success: true
                });
            }
        });
    } else {
        res.send({
            success: false
        });
    }
});

router.get("/logout", (req, res) => {
    let firstName = req.session.firstName;
    req.session = null;

    if (!req.session) {
        res.send({
            success: true,
            message: firstName
        });
    } else {
        res.send({
            success: false
        });
    }
});

module.exports = router;