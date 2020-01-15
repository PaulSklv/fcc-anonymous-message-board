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
            replies: []
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
    console.log(req.body)
      connection.then(client => {
        collection(client, req).findOneAndDelete({
          _id: new Object(req.body.thread_id),
          delete_password: req.body.delete_password
        }).then(result => console.log(result.value));
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
              $currentDate: { bumped_on: true }
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
    });
};
