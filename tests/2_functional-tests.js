/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function(done) {
      chai
        .request(server)
        .post("/api/threads/board")
        .send({
          board: "board",
          title: "Title",
          delete_password: "test"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.equal(res.body.title, "Title");
          assert.equal(res.body.delete_password, "test");
          assert.equal(res.body.board, "test");
          done();
      })
    });
    
    suite('GET', function(done) {
      chai
        .request(server)
        .get("/api/threads/board")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.equal(res.body.title, "Title");
          assert.equal(res.body.delete_password, "test");
          assert.equal(res.body.board, "test");
          done();
      })
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
