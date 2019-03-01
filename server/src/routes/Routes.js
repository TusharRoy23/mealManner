const express = require('express')
const router = express.Router()

const Skills = require("../models/Skills");

router.get("/dashboard", (req, res) => {
    //let userID = req.session.userID;
    let userID = "5c653df4f2f3ae69d7eef4ff";
    if (userID) {
        Skills.find()
            .then(skills => {
                res.send({
                    skills: skills,
                    success: true
                });
            })
            .catch(err => {
                res.send({
                    success: false
                });
            })
    } else {
        res.send({
            success: false
        });
    }

});

router.post("/create", (req, res) => {
    //let userID = req.session.userID;
    let userID = "5c653df4f2f3ae69d7eef4ff";
    if (userID) {
        let arr = {
            skillName: req.body.skillName,
            skillDescription: ""
        }
        Skills.create(arr)
            .then(skills => {
                res.send({
                    skills: skills,
                    success: true
                });
            })
            .catch(err => {
                res.send({
                    success: false
                });
            })
    } else {
        res.send({
            success: false
        });
    }

});

router.put("/update", (req, res) => {
    //let userID = req.session.userID;
    let userID = "5c653df4f2f3ae69d7eef4ff";
    if (userID) {
        let arr = {
            skillName: req.body.skillName,
            skillDescription: req.body.skillDescription
        }
        Skills.findByIdAndUpdate(req.body.id, arr, {
                new: true,
                useFindAndModify: false
            })
            .then(skills => {
                res.send({
                    success: true
                });
            })
            .catch(err => {
                res.send({
                    success: false
                });
            })
    } else {
        res.send({
            success: false
        });
    }

});

router.get("/delete/:id", (req, res) => {
    //let userID = req.session.userID;
    let userID = "5c653df4f2f3ae69d7eef4ff";
    if (userID) {
        var query = {
            _id: req.params.id
        };
        Skills.deleteOne(query)
            .then(skills => {
                res.send({
                    success: true
                });
            })
            .catch(err => {
                res.send({
                    success: false
                });
            })
    } else {
        res.send({
            success: false
        });
    }

});

module.exports = router;