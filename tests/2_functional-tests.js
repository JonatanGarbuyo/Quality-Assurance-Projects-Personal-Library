/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /* 
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testBookId = "";
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {chai.request(server)
          .post('/api/books')
          .send({title:"The Lord of the Rings: The Fellowship of the Ring"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, "title", "response should contain a title");
            assert.property(res.body, "_id", "response should contain _id");
            assert.equal(res.body.title, "The Lord of the Rings: The Fellowship of the Ring");
            testBookId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:""})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing inputs');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
       chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
       chai.request(server)
        .get('/api/books/' + "4ef65c0472700c69bc15acaa")
        .end(function(err, res){
          assert.equal(res.status, 404);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testBookId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            done();
          });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.equal(res.body._id, testBookId);////////
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            done();
          });
      });
      
    });
    
    //DELETE
    
    suite('DELETE /api/books/[id] => DELETE a book from the collection. ', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .delete('/api/books/' + testBookId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');////////
            done();
          });
      });
      
    });
    
    
    

  });

});
