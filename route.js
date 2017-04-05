var express = require('express');
var route = express.Router();
var crud = require('./operations.js');

route.post('/login', function(req, res){
	console.log(req.body.username, ' ', req.body.password);
	crud.login(req.body.username, req.body.password, req.body.del_id, function(data){
		if(data === 'ok'){
			res.json('ok');
		}else{
			res.json('not_ok');
		}
	})

});
route.post('/data', function(req,res)
{
	console.log('pls pay your attention here is your comment -->\n', req.body.comment);
	if(req.session.username){ 
			crud.saveComment(req.body.comment, 'admin', function(data){
				if(data){
					res.json('reply message sent successfully!');
				}
			});	
	}else{
			crud.saveComment(req.body.comment, 'user', function(data){
				if(data){
					res.json('comment successfully sent!');
				}
			});	
	}
});

route.post('/message', function(req, res){
	console.log('here i am going to fetch the data...');
	var limit = parseInt(req.body.limit);
	crud.getComment(limit, function(data){
		console.log('i got data here \n', data);
		res.send(data);
	});
})

route.post('/delete', function(req, res){
	console.log('here i am going to fetch the data...');
	crud.deleteComment('abc123', 4, function(data){
		console.log('i got data here \n', data);
		res.send(data);
	});
})

module.exports = route;