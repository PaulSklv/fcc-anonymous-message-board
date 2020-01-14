/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const connection = MongoClient.connect({
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const collection = client => {
  return client.db("test").collection("messageBoard");
}

module.exports = function (app) {
  
  app.route('/api/threads/:board').post((req, res) => {
    connection.then(client => {
      collection(client).insertOne({
        text: req.body.text,
        delete_password: req.body.delete_password,
        
      })
    })
  })
    
  app.route('/api/replies/:board');

};
