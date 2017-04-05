var client = require('mongodb').MongoClient;
var assert = require('assert');

var express = require('express');
var app = express.Router()
var connect = require('mongodb').MongoClient;
var env = process.env.NODE_ENV || 'dev';
// var saaslaMail = require('./sendMailThroughSaasla.js');

function database(callback){
	if(env === 'dev'){
	    var url = "mongodb://localhost:27017/cook";
	}else{
	    var url = 'mongo mongodb://cook:872909066@ds147510.mlab.com:47510/cook';
	}
    client.connect(url, function(err, db){
        callback(err, db);
    });
}

module.exports.login = function(username, password,id, callback){
	database(function(err, db){
		if(err) throw err;
		var collection = db.collection('login');
		var comment = db.collection('comment');
		collection.find({username : username, password : password}).toArray(function(err, data){
			if(err) throw err;
			if(data && data.length !== 0){
				comment.remove({id : id});
				callback('ok');
			}else{
				callback('not_ok');
			}
		});

	})
}
module.exports.saveComment = function(comment, comment_type, callback){
	 database(function(err, db){
	 	if(err) throw err;
	 	var collection = db.collection('comment');
	 	collection.find({},[], {$sort:{$natural:-1}}).toArray(function(err, data){
	 		if(err) throw err;
	 		if(data){
	 			if(data.length !== 0){
	 				console.log(data[data.length-1]);
	 				collection.insertOne({
	 					'id' : data[data.length-1].id+1,
	 					'comment' : comment,
	 					'createdTime' : Date().toString().replace('GMT+0530 (IST)',''),
	 					'status' : 1,
	 					'comment_type' : comment_type
	 				}).then(function(data){
	 					console.log(data.result.ok === 1)
	 					if(data.result.ok === 1){
	 						console.log('here data comment is entered with comment this :>\n');
	 						callback('ok');
	 						db.close();
	 					}
	 				}, function(err){
	 					console.log('the cause of rejection is >', err);
	 				});
	 			}else{
	 			collection.insertOne({
	 					'id' : 1,
	 					'comment' : comment,
	 					'createdTime' : Date().toString().replace('GMT+0530 (IST)',''),
	 					'status' : 1,
	 					'comment_type' : comment_type
	 				}).then(function(data){
	 					console.log(data.result.ok === 1)
	 					if(data.result.ok === 1){
	 						console.log('here data comment is entered with comment this :>\n');
	 						callback('ok');
	 						db.close();
	 					}
	 				}, function(err){
	 					console.log('the cause of rejection is >', err);
	 				});
	 		}
	 		}
	 	})
	 });
}
module.exports.getComment = function(li, callback){
	database(function(err, db){
	 	if(err) throw err;
	 	var collection = db.collection('comment');
	 	collection.find({status : 1}).toArray(function(err, data){
	 		if(err) throw err;
	 		if(data){
	 			if(data.length !== 0){
	 				var array = [];
	 				for(x in data){
	 					array.push({

	 						id : data[x].id,
	 						comment : data[x].comment,
	 						createdTime : data[x].createdTime,
	 						status : data[x].status,
	 						comment_type : data[x].comment_type
	 					})
	 						// console.log(array);
	 					if(array.length === li){
	 						 console.log(array);
	 						callback(array);
	 						break;
	 					}else if(array.length === (data.length)){
	 						console.log('sorry here i am in data.length and i am sending less no.s of comment than your request!.......', array.length);
	 						callback(array);
	 						break;
	 					}
	 				}
	 			}
	 		}
	 	})
	 });	
}

module.exports.deleteComment = function(username, id, callback){
	database(function(err, db){
	 	if(err) throw err;
	 	var collection = db.collection('login');
	 	var comment = db.collection('comment');
	 	collection.find({username : username}).toArray(function(err, data){
	 		if(err) throw err;
	 		if(data){
	 			if(data.length !== 0){
	 				comment.update({id : id}, {$set : {status : -1}}).then(function(acceptData){
	 					if(acceptData.result.ok === 1){
	 						callback('successfully updated !...........');
	 					}
	 				})
	 			}
	 		}
	 	})
	 });	
}