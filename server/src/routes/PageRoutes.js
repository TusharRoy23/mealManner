const express = require("express");
const router = express.Router();

const PageList = require("../models/PageList");
const PageUserList = require("../models/PageUserList");
const User = require("../models/User");
const Profile = require("../models/Profile");
const mongoose = require("mongoose");
//const verifyToken = require("../VerifyToken");
const PageThreads = require("../models/PageThreads");
const NewsFeeds = require("../models/NewsFeeds");

router.get("/pageList", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";

  if (userID) {
    const query = Profile.findOne({
      userID: userID,
      status: 1
    });
    query.exec(function (err, profile) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        const query = PageUserList.find({
          members: profile._id,
          status: 1
        });

        query.populate("pageID");
        query.sort("-_id");
        query.select("pageID");

        query.exec(function (error, pageUserList) {
          if (error) {
            res.send({
              success: false
            });
          } else {
            const query = NewsFeeds.find({
              userID: profile._id,
              status: 1
            });
            query.sort("-_id");
            query.exec(function (error, feeds) {
              if (error) {
                res.send({
                  success: false
                });
              } else {
                //console.log("page user lists" + userID);
                res.send({
                  pages: pageUserList,
                  feeds: feeds,
                  success: true
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.send({
      success: false
    });
  }
});

router.post("/createPage", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  let title = req.body.title;
  let description = req.body.description;

  if (userID) {
    req.checkBody("title", "Title Required").notEmpty();
    req.checkBody("description", "Description Required").notEmpty();

    var errors = req.validationErrors(true);

    if (errors) {
      res.send({
        success: false
      });
    } else {
      const query = Profile.findOne({
        userID: userID,
        status: 1
      });

      query.exec(function (err, profile) {
        if (err) {
          res.send({
            success: false
          });
        } else {
          var arr = {
            title: title,
            description: description,
            createdBy: profile._id
          };

          PageList.create(arr)
            .then(pagelist => {
              arr = {
                pageID: pagelist._id,
                adminUser: profile._id,
                members: profile._id
              };
              PageUserList.create(arr)
                .then(pageUserlist => {
                  res.send({
                    success: true
                  });
                })
                .catch(err => {
                  res.send({
                    success: false
                  });
                });
            })
            .catch(err => {
              res.send({
                success: false
              });
            });
        }
      });
    }
  } else {
    res.send({
      success: false
    });
  }
});

router.get("/getPage/:id", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";

  if (userID) {
    // const query = PageUserList.find({
    //   pageID: mongoose.Types.ObjectId(req.params.id),
    //   status: 1,
    //   activePageUser: 1
    // });

    // //query.populate("pageID");
    // query.populate("adminUser", "firstName");

    // query.sort("-_id");
    // query.exec(function (err, pageUserList) {
    //   if (err) {
    //     res.send({
    //       success: false
    //     });
    //   } else {
    //     var profile_id = pageUserList.adminUser;
    //     Profile.find({
    //         _id: {
    //           $ne: profile_id
    //         }
    //       },
    //       (error, profile) => {
    //         if (error || !profile) {
    //           res.send({
    //             success: false
    //           });
    //         } else {
    //           //console.log(pageUserList);
    //           res.send({
    //             users: profile,
    //             pageInfo: pageUserList,
    //             success: true
    //           });
    //         }
    //       }
    //     );
    //   }
    // });
    const query = Profile.findOne({
      userID: userID,
      status: 1
    });

    query.exec(function (err, profile) {
      PageUserList.aggregate([{
            $match: {
              pageID: mongoose.Types.ObjectId(req.params.id),
              activePageUser: 1
            }
          },
          {
            $lookup: {
              from: Profile.collection.name,
              localField: "members",
              foreignField: "_id",
              as: "result"
            }
          }
        ])
        .exec()
        .then(function (data) {
          const query = PageThreads.find({
            pageID: req.params.id,
            status: 1
          });
          query.sort('-_id');
          query.populate('userID', 'firstName lastName');
          query.exec(function (err, pagethreads) {
            if (err || !pagethreads) {
              res.send({
                pageInfo: data,
                success: true,
                profileID: profile._id
              });
            } else {
              res.send({
                pageInfo: data,
                pageFeeds: pagethreads,
                profileID: profile._id,
                success: true
              });
            }
          });

        })
        .catch(err => {
          res.send({
            success: false
          });
        });
    });
  } else {
    res.send({
      success: false
    });
  }
});

router.post("/uninvitedUser", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  if (userID) {
    let pageID = req.body.pageID;
    let memberName = req.body.memberName;
    const query = Profile.findOne({
      userID: userID
    });

    query.select("_id");
    query.exec(function (err, profile) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        Profile.aggregate([{
              $match: {
                _id: {
                  $ne: profile._id
                },
                $or: [{
                    firstName: new RegExp(memberName)
                  },
                  {
                    lastName: new RegExp(memberName)
                  }
                ]
              }
            },
            {
              $lookup: {
                from: PageUserList.collection.name,
                localField: "_id",
                foreignField: "members",
                as: "result"
              }
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                _id: 1,
                userID: 1,
                result: {
                  $filter: {
                    input: "$result",
                    as: "result",
                    cond: {
                      $eq: ["$$result.activePageUser", 0],
                      $eq: ["$$result.pageID", mongoose.Types.ObjectId(pageID)]
                    }
                  }
                }
              }
            }
          ])
          .exec()
          .then(function (data) {
            let arr = [];
            data.forEach(element => {
              if (!element.result.length) {
                arr.push(element);
              } else if (!element.result[0].activePageUser) {
                arr.push(element);
              }
              //console.log(element.result[0]);
            });
            //console.log(JSON.stringify(data, null, 2));

            res.send({
              users: arr,
              success: true
            });
          })
          .catch(err => {
            console.log("test");
            res.send({
              success: false
            });
          });
      }
    });
  } else {
    res.send({
      success: false
    });
  }
});

router.post("/inviteUsers", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  if (userID) {
    let pageID = req.body.pageID;
    let invitedMembers = req.body.members;

    req.checkBody("pageID", "pageID Required").notEmpty();
    req.checkBody("invitedMembers", "invitedMembers Required").notEmpty();

    var errors = req.validationErrors(true);

    if (!invitedMembers) {
      console.log("err " + invitedMembers);
      res.send({
        success: false
      });
    } else {
      var arr = {
        pageID: pageID,
        members: invitedMembers,
        adminUser: userID,
        activePageUser: 1
      };

      PageUserList.create(arr)
        .then(pageuserlist => {
          res.send({
            success: true
          });
        })
        .catch(err => {
          res.send({
            success: false
          });
        });
      res.send({
        success: true
      });
    }
  } else {
    res.send({
      success: false
    });
  }
});

router.post("/kickOutUser", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  if (userID) {
    // let tableID = req.body.tableID;
    // console.log("tableID: " + req.body.tableID);
    var arr = {
      activePageUser: 0,
      deactivationDate: new Date().toISOString()
    };
    PageUserList.findByIdAndUpdate(req.body.tableID, arr, {
        new: true,
        useFindAndModify: false
      })
      .then(pageuserlists => {
        res.send({
          success: true
        });
      })
      .catch(err => {
        res.send({
          success: false
        });
      });
  } else {
    res.send({
      success: false
    });
  }
});

router.post('/threadSubmit', (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  if (userID) {
    const query = Profile.findOne({
      userID: userID,
      status: 1
    });

    console.log(req.body);

    query.exec(function (err, profile) {
      let arr = {
        userID: profile._id,
        pageID: req.body.pageID,
        description: req.body.description
      };

      console.log(req.body.pageID);

      PageThreads.create(arr)
        .then(pagethreads => {

          let feedArr = {
            userID: profile._id,
            pageID: req.body.pageID,
            threadID: pagethreads._id
          };

          NewsFeeds.create(feedArr)
            .then(newsfeeds => {
              res.send({
                success: true
              });
            })
            .catch(err => {
              res.send({
                success: false
              });
            })
        })
        .catch(err => {
          res.send({
            success: false
          });
        });
    });
  } else {

  }
});

router.post("/threadDelete", (req, res) => {
  //let userID = req.session.userID;
  let userID = "5c653df4f2f3ae69d7eef4ff";
  if (userID) {
    //let threadID = req.params.id;
    var arr = {
      status: 0,
      deactivationDate: new Date().toISOString()
    }
    console.log("arr");
    PageThreads.findByIdAndUpdate(req.body.threadID, arr, {
        new: true,
        useFindAndModify: false
      })
      .then(pagethreads => {
        NewsFeeds.findOneAndUpdate({
            threadID: req.body.threadID
          }, arr, {
            new: true,
            useFindAndModify: false
          })
          .then(newsfeeds => {
            res.send({
              success: true
            });
          })
          .catch(err => {
            res.send({
              success: false
            });
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