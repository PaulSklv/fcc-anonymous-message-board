/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const { MongoClient, ObjectID } = require('mongodb');

const connection = MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const collection = (client, req) => {
  return client.db("messageBoard").collection(req.params.board);
}

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post((req, res) => {
    connection.then(client => {
      collection(client, req).insertOne({
        text: req.body.text,
        delete_password: req.body.delete_password,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        replies: []
      }).then(result => {
        res.redirect('/b/' + req.params.board);
      }).catch(error => {return console.log("Something went wrong", error)})
    })
  })
  .get((req, res) => {
    connection.then(client => {
      collection(client, req).find({ }).toArray().then(result => {
        return res.send(result);
      }).catch(error => {return console.log("Something went wrong", error)})
    })
  })
    
  app.route('/api/replies/:board').post((req, res) => {
    connection.then(client => {
      collection(client, req).updateOne({ _id: req.body.thread_id })
    })
  })

};
