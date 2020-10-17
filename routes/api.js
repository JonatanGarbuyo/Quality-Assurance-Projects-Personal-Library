/*
*       Complete the API routing below   
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
        if (err) { return console.log(err); }
        const collection = client.db("PersonalLibrary").collection("books");
        
        collection.aggregate({
          $project:{
            "commentcount":{$size:"$comments"},
            _id:true,
            title:true
          }
        }, function(err, docs) {
          if (err) {return console.log(err);}
          res.json(docs);
        });
      });
    })
    
  
// 3. I can post a title to /api/books to add a book and returned will be 
// the object with the title and a unique _id.
    .post(function (req, res){
      if (!req.body.title || req.body.title.length < 1){
        return res.send("missing inputs");
      }
      var book = {
        title : req.body.title,
        comments:[]
      }
      //response will contain new book object including atleast _id and title
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
        if (err) { return console.log(err); }
        const collection = client.db("PersonalLibrary").collection("books");
        collection.insertOne(book, function(err, doc){
          if (err) {return console.log(err);}
          book._id = doc.insertedId;
          res.json(book);
        });
      });
    })
    
  
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
          if (err) { return console.log(err); }
          const collection = client.db("PersonalLibrary").collection("books");
          collection.deleteMany({}, function(err, doc){
            if (err) {return console.log(err);}
            //console.log(doc);////////////////
            res.send('complete delete successful');
          });
        });
    
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      if (!req.params.id) return res.send('Missing book id');
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
        if (err) { return console.log(err); }
        const collection = client.db("PersonalLibrary").collection("books");
        
        collection.findOne({_id: new ObjectId(bookid)}, function(err, doc) {
          if (err) {return console.log(err);}
          if (!doc) {return res.status(404).send('no book exists');}
          res.json(doc);
        });
      });
    })
    
  
    .post(function(req, res){
      var bookid = req.params.id;
      if(!req.body.comment){
          return res.send("missing comment")
        }
      else{
        var comment = req.body.comment;
        //json res format same as .get
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
          if (err) { return console.log(err); }
          const collection = client.db("PersonalLibrary").collection("books");

          collection.findAndModify(
            {_id: new ObjectId(bookid)},
            [['_id',1]],
            {$push:{comments:comment}},
            {new: true},
            function(err, doc) {
            if (err) {return console.log(err);}
            if (!doc) {return res.status(404).send('no book exists');}
            res.json(doc.value);
          });
        });
      }
    })
    
  
  
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client) {
          if (err) { return console.log(err); }
          const collection = client.db("PersonalLibrary").collection("books");
          collection.deleteOne({_id: new ObjectId(bookid)}, function(err, doc){
            if (err) {return console.log(err);}
            
            res.send('delete successful');
          });
        });
    });
  
};
