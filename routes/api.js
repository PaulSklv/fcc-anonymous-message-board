/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const { MongoClient, ObjectID } = require("mongodb");

const connection = MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const collection = (client, req) => {
  return client.db("messageBoard").collection(req.params.board);
};

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      connection.then(client => {
        collection(client, req)
          .insertOne({
            text: req.body.text,
            delete_password: req.body.delete_password,
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [],
            replycount: 0
          })
          .then(result => {
            res.redirect("/b/" + req.params.board);
          })
          .catch(error => {
            return console.log("Something went wrong", error);
          });
      });
    })
    .get((req, res) => {
      connection.then(client => {
        collection(client, req)
          .find({})
          .toArray()
          .then(result => {
            return res.send(result);
          })
          .catch(error => {
            return console.log("Something went wrong", error);
          });
      });
    })
    .delete((req, res) => {
      console.log(req.body);
      connection.then(client => {
        collection(client, req)
          .findOneAndDelete({
            _id: new ObjectID(req.body.thread_id),
            delete_password: req.body.delete_password
          })
          .then(result => {
            if (result.value === null) {
              return res.send("password is incorrect!");
            } else {
              return res.send("successfully deleted!");
            }
          })
          .catch(error => {
            return res.send("something went wrong!");
          });
      });
    })
    .put((req, res) => {
      connection.then(client => {
        collection(client, req)
          .findOneAndUpdate(
            { _id: new ObjectID(req.body.report_id) },
            { $set: { reported: true } },
            { returnOriginal: false }
          )
          .then(result => {
            if (result.value === null) {
              return res.send("thread doesn't esists!");
            } else {
              return res.send("success!");
            }
          });
      });
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      connection.then(client => {
        collection(client, req)
          .findOneAndUpdate(
            { _id: new ObjectID(req.body.thread_id) },
            {
              $push: {
                replies: {
                  _id: new ObjectID(),
                  text: req.body.text,
                  created_on: new Date(),
                  delete_password: req.body.delete_password,
                  reported: false
                }
              },
              $currentDate: { bumped_on: true },
              $inc: { replycount: 1 }
            },
            { returnOriginal: false }
          )
          .then(result => {
            return res.redirect(
              "/b/" + req.params.board + "/" + req.body.thread_id
            );
          })
          .catch(error => console.log(error));
      });
    })
    .get((req, res) => {
      console.log(req.query);
      connection.then(client => {
        collection(client, req)
          .find({ _id: new ObjectID(req.query.thread_id) })
          .toArray()
          .then(result => {
            return res.send(result[0]);
          });
      });
    })
    .delete((req, res) => {
      connection.then(client => {
        collection(client, req)
          .findOneAndUpdate(
            {
              _id: new ObjectID(req.body.thread_id),
              replies: {
                $elemMatch: {
                  _id: new ObjectID(req.body.reply_id),
                  delete_password: req.body.delete_password
                }
              }
            },
            {
              $pull: {
                replies: {
                  _id: new ObjectID(req.body.reply_id),
                  delete_password: req.body.delete_password
                }
              },
              $inc: { replycount: -1 }
            },
            { returnOriginal: false }
          )
          .then(result => {
            if (result.value === null) {
              return res.send("delete password is incorrect!");
            } else {
              return res.send("successfully deleted!");
            }
          });
      });
    })
    .put((req, res) => {
      connection.then(client => {
        collection(client, req).findOneAndUpdate(
          {
            _id: new ObjectID(req.body.thread_id),
            replies: { $elemMatch: { _id: new ObjectID(req.body.reply_id) } }
          },
          {
            $set: { "replies.$[elem].reported": true }
          },
          {
            arrayFilters: [
              { "elem._id": { $eq: new ObjectID(req.body.reply_id) } }
            ]
          }
        ).then(result => {
          if(result.value === null) {
            return res.send("reply doesn't exist!")
          } else {
            return res.send("success!")
          }
        });
      });
    });
};
