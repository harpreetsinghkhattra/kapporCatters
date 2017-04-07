// var express = require('express');
// var router = express.Router();
// var client = require('mongodb').MongoClient;
// var assert = require('assert');

// function database(callback){
//     var url = "mongodb://localhost:27017/saasla";
//     client.connect(url, function(err, db){
//         callback(err, db);
//     });
// }

// router.post('/saveMessage', function(req, res){
// 	database(function(err, db){
// 		var collection = db.collection('comment');
// 		collection.insert({
// 			"id" : 1,
// 			"comment" : 'hello this for test',
// 			"createdTime" : new Date().toDateString(),
// 			"status" : 1,
// 			'image' : image
// 		});
// 	})
// });

// router.post('/getMessage', function(req, res){
// 	database(function(err, db){
// 		var collection = db.collection('comment');
// 		collection.find({}).toArray(function(err, data){
// 			if(err) throw err;
// 			if(data && data !== 0){
// 				res.json(data);
// 				res.end();
// 			}
// 		})
// 	})
// });